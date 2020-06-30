from rest_framework_jwt.settings import api_settings

def create_token(user):
    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
    payload = jwt_payload_handler(user)
    payload['divisi'] = user.divisi
    payload['jabatan'] = user.jabatan
    token = jwt_encode_handler(payload)

    return token

def get_client_ip(request):
    ip = None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')

    return ip

def get_status_color(obj):
	warna = ""
	if obj.status == 2:
		warna = 'warning'
	elif obj.status == 3:
		warna = 'info'
	return warna

STATUS = (
	(1, 'Active'),
	(2, 'Archive'),
	(3, 'Draft'),
)

JENIS_KELAMIN = (
	('Pria', 'Pria'),
	('Wanita', 'Wanita')
)

def jwt_response_payload_handler(token, user=None, request=None):
    print(token)
    return {
        'token': token,
        'username': user.username,
        'user_id' : user.id,
        'email' : user.email,
        'divisi' : user.divisi,
        'jabatan' : user.jabatan
    }
