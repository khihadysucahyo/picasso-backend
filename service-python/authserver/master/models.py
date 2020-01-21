# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.utils.deconstruct import deconstructible
from django.contrib.postgres.indexes import GinIndex
import django.contrib.postgres.search as pg_search
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver
from django.conf import settings
from datetime import datetime
from django.db import models
from uuid import uuid4

import os

from accounts.utils import STATUS, get_status_color

# Create your models here.
class MetaAtribut(models.Model):
	status = models.PositiveSmallIntegerField(verbose_name='Status Data', choices=STATUS, default=6, db_index=True)
	created_by = models.ForeignKey("accounts.Account", on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s_create_by_user", verbose_name="Dibuat Oleh", blank=True, null=True)
	created_at = models.DateTimeField(editable=False,null=True)
	verified_by = models.ForeignKey("accounts.Account", on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s_verify_by_user", verbose_name="Diverifikasi Oleh", blank=True, null=True)
	verified_at = models.DateTimeField(editable=False, blank=True, null=True)
	rejected_by = models.ForeignKey("accounts.Account", on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s_rejected_by_user", verbose_name="Dibatalkan Oleh", blank=True, null=True)
	rejected_at = models.DateTimeField(editable=False, blank=True, null=True)

	updated_at = models.DateTimeField(auto_now=True)

	# sv = pg_search.SearchVectorField(null=True, blank=True) 
	
	def get_color_status(self):
		return get_status_color(self)
		
	def save(self, *args, **kwargs):
		''' On save, update timestamps '''
		if not self.id:
			self.created_at = datetime.now()
		self.updated_at = datetime.now()
		return super(MetaAtribut, self).save(*args, **kwargs)

	# def __unicode__(self):
	# 	return u'%s' % (str(self.status))

	class Meta:
		# indexes = [GinIndex(fields=['sv','status'])]
		abstract = True

class JenisNomorIdentitas(models.Model):
	jenis_nomor_identitas = models.CharField(max_length=30, verbose_name='Jenis Nomor Identitas')
	keterangan = models.CharField(max_length=255, blank=True, null=True)

	sv = pg_search.SearchVectorField(null=True, blank=True) 
	def __unicode__(self):
		return u'%s. %s' % (self.id, self.jenis_nomor_identitas)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['id']
		verbose_name = 'Jenis Nomor Identitas'
		verbose_name_plural = 'Jenis Nomor Identitas'

class Settings(models.Model):
	parameter = models.CharField("Nama Parameter", max_length=100)
	value = models.CharField("Nilai", max_length=100)
	url = models.URLField("Url", max_length=200, null=True,blank=True)

	class Meta:
		verbose_name='Setting'
		verbose_name_plural='Setting'


# ALAMAT LOKASI #
class Negara(models.Model):
	nama_negara = models.CharField(max_length=40, verbose_name="Negara", db_index=True)
	keterangan = models.CharField(max_length=255, blank=True, null=True, verbose_name="Keterangan")
	code = models.CharField(max_length=10, blank=True, null=True, verbose_name="Kode Negara")
	lt = models.CharField(max_length=100, null=True, blank=True, verbose_name='Latitute')
	lg = models.CharField(max_length=100, null=True, blank=True, verbose_name='Longitute')

	sv = pg_search.SearchVectorField(null=True, blank=True) 
	def __unicode__(self):
		return "%s" % (self.nama_negara,)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['nama_negara']
		verbose_name = "Negara"
		verbose_name_plural = "Negara"

class Provinsi(models.Model):
	negara = models.ForeignKey(Negara, on_delete=models.CASCADE, verbose_name="Negara", db_index=True)
	kode = models.CharField(verbose_name="Kode", max_length=6, blank=True, null=True, db_index=True)
	nama_provinsi = models.CharField(max_length=40, verbose_name="Provinsi")
	keterangan = models.CharField(max_length=255, blank=True, null=True, verbose_name="Keterangan")
	lt = models.CharField(max_length=100, null=True, blank=True, verbose_name='Latitute')
	lg = models.CharField(max_length=100, null=True, blank=True, verbose_name='Longitute')

	sv = pg_search.SearchVectorField(null=True, blank=True) 
	def as_json(self):
		return dict(id=self.id, nama_provinsi=self.nama_provinsi, negara=self.negara.nama_negara, keterangan=self.keterangan)

	def as_option(self):
		return "<option value='"+str(self.id)+"'>"+str(self.nama_provinsi)+"</option>"

	def __unicode__(self):
		return "%s" % (self.nama_provinsi,)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['nama_provinsi']
		verbose_name = "Provinsi"
		verbose_name_plural = "Provinsi"

class Kabupaten(models.Model):
	"""docstring for Kabupaten"""
	provinsi = models.ForeignKey(Provinsi, on_delete=models.CASCADE, verbose_name="Provinsi", db_index=True)
	kode = models.CharField(verbose_name="Kode", max_length=6, blank=True, null=True, db_index=True)
	nama_kabupaten = models.CharField(max_length=40, verbose_name="Kabupaten / Kota")
	keterangan = models.CharField(max_length=255, blank=True, null=True, verbose_name="Keterangan")
	lt = models.CharField(max_length=100, null=True, blank=True, verbose_name='Latitute')
	lg = models.CharField(max_length=100, null=True, blank=True, verbose_name='Longitute')

	sv = pg_search.SearchVectorField(null=True, blank=True) 	
	def as_option(self):
		return "<option value='"+str(self.id)+"'>"+str(self.nama_kabupaten)+"</option>"

	def as_option_complete(self):
		return "<option value='"+str(self.id)+"'>"+str(self.nama_kabupaten)+", "+str(self.provinsi.nama_provinsi)+" - "+str(self.provinsi.negara.nama_negara)+"</option>"
		
	def __unicode__ (self):
		return "%s" % (self.nama_kabupaten,)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]			
		ordering = ['nama_kabupaten']
		verbose_name = "Kabupaten / Kota"
		verbose_name_plural = "Kabupaten / Kota"

class Kecamatan(models.Model):
	"""docstring for Kecamatan"""
	kabupaten = models.ForeignKey(Kabupaten, on_delete=models.CASCADE, verbose_name="Kabupaten / Kota", db_index=True)
	kode = models.CharField(verbose_name="Kode", max_length=6, blank=True, null=True, db_index=True)
	nama_kecamatan = models.CharField(max_length=40, verbose_name="Kecamatan")
	keterangan = models.CharField(max_length=255, blank=True, null=True, verbose_name="Keterangan")
	lt = models.CharField(max_length=100, null=True, blank=True, verbose_name='Latitute')
	lg = models.CharField(max_length=100, null=True, blank=True, verbose_name='Longitute')

	sv = pg_search.SearchVectorField(null=True, blank=True) 
	def as_json(self):
		return dict(id=self.id, nama_kecamatan=self.nama_kecamatan, keterangan=self.keterangan)

	def as_option(self):
		return "<option value='"+str(self.id)+"'>"+str(self.nama_kecamatan)+"</option>"

	def __unicode__(self):
		return "%s" % (self.nama_kecamatan,)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['nama_kecamatan']
		verbose_name = "Kecamatan"
		verbose_name_plural = "Kecamatan"

class Desa(models.Model):
	"""docstring for Desa"""
	kecamatan = models.ForeignKey(Kecamatan, on_delete=models.CASCADE, verbose_name="Kecamatan", db_index=True)
	kode = models.CharField(verbose_name="Kode", max_length=6, blank=True, null=True)
	nama_desa = models.CharField(max_length=40, null=True, verbose_name="Nama Desa / Kelurahan", db_index=True)
	keterangan = models.CharField(max_length=255, blank=True, null=True, verbose_name="Keterangan")
	lt = models.CharField(max_length=100, null=True, blank=True, verbose_name='Latitute')
	lg = models.CharField(max_length=100, null=True, blank=True, verbose_name='Longitute')
	sv = pg_search.SearchVectorField(null=True, blank=True) 

	def alamat_lengkap(self):
		return self.nama_desa+" "+self.kecamatan.nama_kecamatan+" "+self.kecamatan.kabupaten.nama_kabupaten+" "+self.kecamatan.kabupaten.provinsi.nama_provinsi

	def get_complete_location_dictionary(self):
		negara = ''
		provinsi = ''
		kabupaten = ''
		kecamatan = ''
		desa = self.nama_desa
		
		negara_id = ''
		provinsi_id = ''
		kabupaten_id = ''
		kecamatan_id= ''
		desa_id = self.id

		if self.kecamatan:
			kecamatan_id = self.kecamatan.id
			kecamatan = self.kecamatan.nama_kecamatan
			if self.kecamatan.kabupaten:
				kabupaten_id = self.kecamatan.kabupaten.id
				kabupaten = self.kecamatan.kabupaten.nama_kabupaten
				if self.kecamatan.kabupaten.provinsi:
					provinsi_id = self.kecamatan.kabupaten.provinsi.id
					provinsi = self.kecamatan.kabupaten.provinsi.nama_provinsi
					if kecamatan.kabupaten.provinsi.negara:
						negara_id = self.kecamatan.kabupaten.provinsi.negara.id
						negara = self.kecamatan.kabupaten.provinsi.negara.nama_negara
		return dict(negara=negara, negara_id=negara_id, provinsi=provinsi, provinsi_id=provinsi_id, kabupaten=kabupaten, kabupaten_id=kabupaten_id, kecamatan=kecamatan, kecamatan_id=kecamatan_id, desa=desa, desa_id=desa_id)

	def as_option(self):
		return "<option value='"+str(self.id)+"'>"+str(self.nama_desa)+"</option>"

	def as_option_desa(self):
		return "<option value='"+str(self.id)+"'>"+str(self.kecamatan.kabupaten.nama_kabupaten.title())+"- Kec."+str(self.kecamatan.nama_kecamatan.title())+"- Ds."+str(self.nama_desa.title())+"</option>"

	def __unicode__(self):
		return "%s" % (self.nama_desa,)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['nama_desa']
		verbose_name = "Desa / Kelurahan"
		verbose_name_plural = "Desa / Kelurahan"

# END OF ALAMAT LOKASI #

class Agama(models.Model):
	agama = models.CharField("Agama", max_length=100, unique=True, db_index=True)
	keterangan = models.CharField("Keterangan", blank=True, null=True, max_length=255)

	sv = pg_search.SearchVectorField(null=True, blank=True) 
	def __unicode__(self):
		return self.agama

	class Meta:
		indexes = [GinIndex(fields=['sv'])]	
		verbose_name='Agama'
		verbose_name_plural='Agama'


class JenisKelamin(models.Model):
	jenis_kelamin = models.CharField("Jenis Kelamin", max_length=100, db_index=True)
	keterangan = models.CharField("Keterangan", blank=True, null=True, max_length=255)
	sv = pg_search.SearchVectorField(null=True, blank=True) 
	
	def __unicode__(self):
		return self.jenis_kelamin

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		verbose_name='Jenis Kelamin'
		verbose_name_plural='Jenis Kelamin'


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

path_and_rename = PathAndRename("berkas/")

class FileField(models.FileField):
	def save_form_data(self, instance, data):
		if data is not None: 
			file = getattr(instance, self.attname)
			if file != data:
				file.delete(save=False)
		super(FileField, self).save_form_data(instance, data)

class Berkas(MetaAtribut):
	nama_berkas = models.CharField("Nama Berkas", max_length=100, blank=True, null=True, db_index=True)
	berkas = FileField(upload_to=path_and_rename, max_length=255)
	no_berkas = models.CharField("Nomor Berkas", max_length=30, blank=True, null=True, help_text="Masukkan Nomor Surat / Berkas jika ada.", db_index=True)

	keterangan = models.CharField("Keterangan", blank=True, null=True, max_length=255)
	sv = pg_search.SearchVectorField(null=True, blank=True)
	 
	def get_file_url(self):
		if self.berkas:
			return settings.MEDIA_URL+str(self.berkas)
		return "#"

	def __unicode__(self):
		return str(self.nama_berkas)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		verbose_name='Berkas'
		verbose_name_plural='Berkas'