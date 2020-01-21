# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from dateutil.relativedelta import relativedelta
from django.contrib.postgres.indexes import GinIndex
import django.contrib.postgres.search as pg_search

from master.models import JenisNomorIdentitas, Desa, MetaAtribut

from datetime import datetime, date
from django.conf import settings

from django.contrib.auth.models import (
	BaseUserManager, AbstractBaseUser
)

from django.contrib.auth.models import PermissionsMixin

from django.utils.deconstruct import deconstructible

from uuid import uuid4

import os, re

@deconstructible
class PathAndRename(object):

	def __init__(self, sub_path):
		self.path = sub_path

	def __call__(self, instance, filename):
		ext = filename.split('.')[-1]
		# set filename as random string
		filename = '{}.{}'.format(uuid4().hex, ext)
		# return the whole path to the file
		return os.path.join(self.path, filename)
path_and_rename = PathAndRename("profiles/")

class ImageField(models.ImageField):
	def save_form_data(self, instance, data):
		if data is not None: 
			file = getattr(instance, self.attname)
			if file != data:
				file.delete(save=False)
		super(ImageField, self).save_form_data(instance, data)

class AccountManager(BaseUserManager):
	def create_user(self, email, username, password=None):
		"""
		Creates and saves a User with the given email, date of
		birth and password.
		"""
		if not username:
			raise ValueError('Users must have an username address')

		user = self.model(
			email=email,
			username=username,
			# first_name=first_name,
			# last_name=last_name,
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password):
		"""
		Creates and saves a superuser with the given email, date of
		birth and password.
		"""
		user = self.create_user(
			email,
			username,
			password=password,
			# first_name=first_name,
			# last_name=last_name,
		)
		user.is_admin = True
		user.save(using=self._db)
		return user


class Account(AbstractBaseUser,PermissionsMixin, MetaAtribut):
	email = models.EmailField(unique=True, blank=True, null=True)
	username = models.CharField(max_length=40, unique=True, db_index=True)
	first_name = models.CharField("Nama Depan", max_length=100, db_index=True)
	last_name = models.CharField("Nama Belakang", max_length=100, db_index=True)
	
	tempat_lahir = models.CharField(max_length=30, verbose_name='Tempat Lahir', null=True, blank=True)
	tanggal_lahir = models.DateField(verbose_name='Tanggal Lahir', null=True, blank=True)
	telephone = models.CharField(verbose_name='Telepon', max_length=50, null=True, blank=True)
	desa = models.ForeignKey(Desa, on_delete=models.CASCADE, verbose_name="Desa", null=True, blank=True)
	alamat = models.CharField(max_length=255)
	lt = models.CharField(max_length=50, verbose_name='lt', blank=True, null=True)
	lg = models.CharField(max_length=50, verbose_name='lg', blank=True, null=True)

	foto = ImageField(upload_to=path_and_rename, max_length=255, null=True, blank=True)
	sv = pg_search.SearchVectorField(null=True, blank=True) 

	is_active = models.BooleanField(default=True)
	is_admin = models.BooleanField(default=False)

	objects = AccountManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email',]
	# 'first_name','last_name']

	def get_complete_location_dictionary(self):
		negara = ''
		provinsi = ''
		kabupaten = ''
		kecamatan = ''
		desa = ''
		negara_id = ''
		provinsi_id = ''
		kabupaten_id = ''
		kecamatan_id= ''
		desa_id = ''
		if self.desa:
			return self.desa.get_complete_location_dictionary()
		return dict(negara=negara, negara_id=negara_id, provinsi=provinsi, provinsi_id=provinsi_id, kabupaten=kabupaten, kabupaten_id=kabupaten_id, kecamatan=kecamatan, kecamatan_id=kecamatan_id, desa=desa, desa_id=desa_id)

	# def is_pegawai(self):
	# 	if request.user.pegawai:
	# 		return True
	# 	else:
	# 		return False

	# @property
	def get_years_birthday(self):
		years = "-"
		if self.tanggal_lahir:
			rdelta = relativedelta(date.today(), self.tanggal_lahir)
			years = rdelta.years
			return years
		return years

	def get_month_birthday(self):
		months = "-"
		if self.tanggal_lahir:
			rdelta = relativedelta(date.today(), self.tanggal_lahir)
			months = rdelta.months
			return months			 
		return months

	def get_day_birthday(self):
		days = "-"
		if self.tanggal_lahir:
			rdelta = relativedelta(date.today(), self.tanggal_lahir)
			days = rdelta.days
			return days			 
		return days

	def is_staff(self):
		"Allow All Member to Login"
		# Simplest possible answer: All admins are staff

		return self.is_active

	# def get_short_name(self):
	# 	# The user is identified by their nama
	# 	return self.nama_lengkap

	def get_full_name(self):
		# The user is identified by their nama
		return self.first_name +' '+ self.last_name

	def get_alamat(self):
		a = "-"
		if self.alamat:
			a = self.alamat
		if self.desa:
			a = a+" "+self.desa.alamat_lengkap()
		return a

	def get_foto(self):
		if self.foto:
			return settings.MEDIA_URL+str(self.foto.url)
		return settings.STATIC_URL+"images/no-avatar.jpg"

	def get_nip_format(self):
		j = str(self.username)
		awal = j[:8]
		tengah = j[-10:]
		tengah_1 = tengah[:6]
		akhir = j[-4:]
		akhir_1 = akhir[:1]
		akhir_2 = akhir[-3:]

		gabung = awal +" "+tengah_1+" "+akhir_1+" "+akhir_2
		
		return gabung

	def __str__(self):
		return u'%s' % (self.email)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['id']
		verbose_name = 'Akun'
		verbose_name_plural = 'Akun'

class NomorIdentitasPengguna(models.Model):
	nomor = models.CharField(max_length=100, unique=True, db_index=True)
	user = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='User')
	jenis_identitas = models.ForeignKey(JenisNomorIdentitas, on_delete=models.CASCADE, verbose_name='Jenis Nomor Identitas')

	def set_as_username(self):
		self.user.username = re.sub('[^0-9a-zA-Z]+', '', self.nomor)
		self.user.save()

	def __unicode__(self):
		return u'%s' % (self.nomor)

	class Meta:
		verbose_name = 'Nomor Identitas Pengguna'
		verbose_name_plural = 'Nomor Identitas Pengguna'

class AccountHistoryAction(models.Model):
	action = models.CharField(max_length=100)
	user = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='User')
	keterangan = models.CharField(max_length=255, blank=True, null=True)

	created_at = models.DateTimeField(editable=False)
	updated_at = models.DateTimeField(auto_now=True)

	def save(self, *args, **kwargs):
		''' On save, update timestamps '''
		if not self.id:
			self.created_at = datetime.now()
		self.updated_at = datetime.now()
		return super(AccountHistoryAction, self).save(*args, **kwargs)

	def __unicode__(self):
		return u'%s' % (self.action)

	class Meta:
		verbose_name = 'Riwayat Aksi Pengguna'
		verbose_name_plural = 'Riwayat Aksi Pengguna'
