const bcrypt = require('bcrypt');
const express = require('express');
//const User = require('../models/User');
const Organizer = require('../models/Organizer');
const Organization = require('../models/Organization');



exports.createOrganizer = async (req, res) => {
    try {
      const organizer = await Organizer.create(req.body);
      res.status(201).json({
        status: 'success',
        organizer,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail', 
        error,
      });
    }
  };
  
  exports.createOrganizer = async (req, res) => {
    try {
      const { companyName, taxNumber, telephone, email } = req.body;
  
      // Telefon numarası veya e-posta adresi kontrolü
      if (!telephone && !email && !companyName && !taxNumber) {
        return res.status(400).json({
          status: 'fail',
          message: 'Boş gönderilemez',
        });
      } else if ((!companyName || !taxNumber ||  !telephone || !taxNumber ||  !telephone  || !email)  ) {
        return res.status(400).json({
          status: 'fail',
          message: 'Boş Bırakılamaz',
        });
      }
  
      // Eğer telefon numarası veya e-posta adresi daha önce kullanıldıysa
      const existingOrganizercompanyName = await User.findOne({ companyName });
      const existingOrganizertaxNumber = await User.findOne({ taxNumber });
      const existingOrganizerTelephone = await User.findOne({ telephone }); //varsa eşitler yoksa null gönderir
      const existingOrganizerEmail = await User.findOne({ email }); //varsa eşitler yoksa null gönderir


      if (existingOrganizercompanyName && existingOrganizertaxNumber && existingOrganizerTelephone && existingOrganizerEmail) { 
        return res.status(400).json({
          status: 'fail',
          message: 'Bu şirket adı, vergi numarası, telefon numarası ve e-posta adresi zaten kullanılıyor. Lütfen geçerli bilgileri giriniz.',
        });
      } else if (existingOrganizercompanyName) {
        return res.status(400).json({
          status: 'fail',
          message: 'Bu şirket adı zaten kullanılıyor. Lütfen farklı bir şirket adı giriniz.',
        });
      } else if (existingOrganizertaxNumber) {
        return res.status(400).json({
          status: 'fail',
          message: 'Bu vergi numarası zaten kullanılıyor. Lütfen farklı bir vergi numarası giriniz.',
        });
      } else if (existingOrganizerTelephone) {
        return res.status(400).json({
          status: 'fail',
          message: 'Bu telefon numarası zaten kullanılıyor. Lütfen farklı bir telefon numarası giriniz.',
        });
      } else if (existingOrganizerEmail) {
        return res.status(400).json({
          status: 'fail',
          message: 'Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta adresi giriniz.',
        });
      }
      
  
      // Yeni kullanıcı oluşturuluyor
      const organizer = await Organizer.create(req.body);
      res.status(201).json({
        status: 'success',
        organizer,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
  
  exports.createOrganization = async (req, res) => {
    try {
      const organization = await Organization.create(req.body);
      res.status(201).json({
        status: 'success',
        organization,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
 
  exports.loginOrganizer = async (req, res) => {
    try {
      const { email, password } = req.body; //İstek gövdesinden gelen email ve password değerlerini çıkartıyoruz.(Kullanıcıdan veriyi aldığımız kısım)
      const organizer = await Organizer.findOne({ email }); // Kullanıcıdan aldığınız email değeriyle, veritabanında User modelindeki email alanı eşleşen bir kullanıcı belgesini bulmak için
      console.log( organizer); 
      if (!organizer) {
        return res.status(400).json({
          status: 'fail',
          error: 'Girdiğiniz email yanlış',
        });
      }
      const same = await bcrypt.compare(password, organizer.password); //kullanıcının girdiği şifrenin, veritabanındaki kullanıcının şifresiyle eşleşip eşleşmediğini kontrol eder,Karşılaştırma sonucu same değişkenine atanır.
      if (same) {
        //eğer şifreler eşleşirse çalışır yoksa üstteki if çalışır
        req.session.organizerID = organizer._id; //Yukarıda tanımladığımız user'ın id'sini userID'ye atayacağız (Her kullanıcının farklı ıd'si vardı bu da o)(Hangi kullanıcının giriş işlemi yaptığını ayıt edebiliriz)
        res.status(200).json({
          status: 'success',
          organizer,
        });
      } else {
        res.status(400).json({
          status: 'fail',
          error: 'Girdiğiniz sifre yanlış',
        });
      }
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
  

//TEKİL KİSİ
exports.getOrganizer = async (req, res) => {
  try {
    //burada Id yerine slug yakalıyoruz linkte ıd yerine title gözüksün diye
    const organizer = await Organizer.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      organizer,
    });
    console.log(organizer);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
}; 

//TEKİL KİSİ
exports.getOrganization = async (req, res) => {
  try {
    //burada Id yerine slug yakalıyoruz linkte ıd yerine title gözüksün diye
    const organization = await Organization.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      organization,
    });
    console.log(organization);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
}; 

// Organizasyon Listelemek 
exports.getAllOrganization = async (req, res) => {
  try {
    const searchQuery = req.query.search; // Kullanıcının arama çubuğuna girdiği değeri alın
    const filter = {};

    if (searchQuery) {
      // Arama sorgusu varsa, "name" alanında veritabanında regex ile filtrele
      filter.name = { $regex: new RegExp(`^${searchQuery}`, 'i') };
    }

    // Tüm organizasyonları veritabanından çekin ve filtreleyin
    const organizations = await Organization.find(filter);

    // Tarihleri şuanki tarihe göre sırala (en yakın tarih en üste gelecek şekilde)
    organizations.sort((a, b) => {
      const aStartDate = new Date(a.startDate);
      const bStartDate = new Date(b.startDate);
      const currentDate = new Date();

      const timeDifferenceA = Math.abs(currentDate - aStartDate);
      const timeDifferenceB = Math.abs(currentDate - bStartDate);

      return timeDifferenceA - timeDifferenceB;
    });

    res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};



