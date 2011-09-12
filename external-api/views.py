from django.contrib.auth.models import User
from django.db.models.query_utils import Q
from django.http import HttpResponse
from django.contrib.auth import authenticate, login as auth_login
from account.models import UserProfile
from alliance.models import Alliance
from battle.models import Battle
from checkin.models import Checkin
from location.models import Location
from datetime import datetime, timedelta
from nodejs_server.utils import encode_for_socketio
from territory.models import Territory

def login(request):
    username = request.GET['username']
    password =  request.GET['password']

    user = authenticate(username = username, password = password)
    if user:
        return HttpResponse('login')
    else:
        return HttpResponse('not_logged')

def getbattleresults(battle):
    attackers_checkins = Checkin.objects.filter(user__in=battle.attacker.members.all(), battle=battle).count()
    defender_checkins = Checkin.objects.filter(user__in=battle.defender.members.all(), battle=battle).count()

    return attackers_checkins - defender_checkins

def checkin_notification(msg):
    SOCKET_IO_HOST = "127.0.0.1"
    SOCKET_IO_PORT = 8080

    socket_io_url = 'ws://' + SOCKET_IO_HOST + ':' + str(SOCKET_IO_PORT) + '/socket.io/websocket'

    ws = websocket.create_connection(socket_io_url)

    msg = encode_for_socketio(msg)
    ws.send(msg)

def checkingin(request):
    if request.method == 'GET':
        userName = request.GET['username']
        locName = request.GET['checkin']
        locLong = request.GET['lng']
        locLang = request.GET['lat']
        up = UserProfile.objects.get(user__username=userName)
        location, created = Location.objects.get_or_create(name=locName, lng=locLong, lat=locLang)
        if created:
            location.subscription = 1
            location.save()

        checkin = Checkin(user=up, location=location)
        nowdatetime = datetime.now()

        try:
            battle = Battle.objects.get(Q(attacker__members=up)|Q(defender__members=up), active=True, capital=location)
            try:
                latest_checkin = Checkin.objects.filter(user=up, location=location).order_by('-created_at')[0]
                if (nowdatetime - latest_checkin.created_at) < timedelta (seconds = 1):
                    return HttpResponse('to short')
            except Exception:
                pass

            checkin.created_at = nowdatetime
            checkin.battle = battle
            checkin.save()

            if nowdatetime - battle.start_time >= timedelta(hours = 24):
                if getbattleresults(battle) < 0:
                    battle.winner = battle.defender
                else:
                    battle.winner = battle.attacker

                battle.save()
                    
        except Battle.DoesNotExist:
            try:
                latest_checkin = Checkin.objects.filter(user=up, location=location).order_by('-created_at')[0]
                if (nowdatetime - latest_checkin.created_at) < timedelta (seconds = 2):
                    return HttpResponse('to short2')
            except Exception:
                pass

            checkin.created_at = nowdatetime
            checkin.save()



            money = location.subscription * up.lvl * up.lvl
            exp = location.subscription * up.lvl

            up.money += ( money * (100 - up.money_to_all) ) / 100
            up.exp += ( exp * (100 - up.exp_to_all ) ) / 100
            if up.exp >= 5 * up.lvl * up.lvl:
                up.lvl += 1
            up.save()

            checkin_notification({'type':'up_notification', 'recipients':up.user.username})
            try:
                alliance = Alliance.objects.get(members=up)
                users = alliance.members.all()
                node_users = []
                for user in users:
                    node_users.append(user.user.username)
                    user.money += up.money_to_all
                    user.exp += up.exp_to_all
                    if user.exp >= 5 * user.lvl * user.lvl:
                        user.lvl += 1
                    user.save()
                checkin_notification({'type':'alliance_notification', 'recipients':node_users})
            except Alliance.DoesNotExist:
                pass
            try:
                owner = UserProfile.objects.get(territory__locations=location)
                if owner != up:
                    owner.exp += up.lvl * location.subscription / UserProfile.objects.filter(alliance_set__members=owner).count() / 2
                    owner.lvl += up.lvl * up.lvl * location.subscription / 2
                    if owner.exp >= 5 * owner.lvl * owner.lvl:
                        owner.lvl += 1
                    owner.save()
            except UserProfile.DoesNotExist:
                pass
    return HttpResponse('a')
