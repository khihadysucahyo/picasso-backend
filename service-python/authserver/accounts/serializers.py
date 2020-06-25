from rest_framework import serializers
from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from django.db.models import Q
from .models import Account
from .utils import create_token

class AccountSerializer(serializers.ModelSerializer):
    nama_lengkap = serializers.SerializerMethodField('get_nama_lengkap_')
    is_active = serializers.SerializerMethodField('get_status_')

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return Account.objects.create(**validated_data)

    class Meta:
        model = Account
        fields = (
            'email',
            'nama_lengkap',
            'username',
            'is_active',
            'foto',
            'divisi',
            'jabatan'
        )

    def get_nama_lengkap_(self, obj):
        return obj.get_full_name()

    def get_status_(self, obj):
        return obj.is_staff()

class AccountLoginSerializer(serializers.HyperlinkedModelSerializer):
    user_obj = None
    token = serializers.CharField(allow_blank=True,read_only=True)
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        model = Account
        fields = ('username','password','email','token')
        extra_kwargs = {'password':
                            {'write_only': True},
                            }

    def validate(self, data):
        username = data.get("username", None)
        password = data["password"]
        if not username:
            raise ValidationError("Username/Email harus di isi")

        user = Account.objects.filter(Q(username=username)|Q(email=username)).distinct()
        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise ValidationError("Usernam/Email yang anda masukkan tidak terdaftar")
        if user_obj:
            if not user_obj.check_password(password):
                raise ValidationError("Password yang anda masukkan salah")
            token = create_token(user_obj)

        data["email"] = user_obj.email
        data["token"] = token
        return data
