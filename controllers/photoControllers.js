const Photo =require('../models/Photo.js');
const fs = require('fs');


exports.getAllPhotos = async (req, res) => {
  //.sort('-dateCreated') bu kısım yeni ekleneni başa yazar ana sayfada (- eklemesydik en son ekleneni en sona yazardı)
  const photos = await Photo.find({}).sort('-dateCreated'); //Fotoğrafları yakaladık //asenkron kullanmamızın nedeni işlem bitene kadar beklememesi lazım daha hızlı çalışması için çünkü zaman alan bir işlem
  res.render('index', {
    photos,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'Public/uploads';
  //Klasörün olup olmadığını kontrol ediyoruz eğer klasör yoksa klasör oluşturacak varsa aşağıdan devam edecek
  if (!fs.existsSync(uploadDir)) {
    //Public/uploads klasörünün zaten var olup olmadığı kontrol edilir. (! işareti de )
    fs.mkdirSync(uploadDir); //Klasör yoksa, fs.mkdirSync yöntemi kullanılarak bu klasör oluşturulur
  }

  let uploadeImage = req.files.image; //image yazmamızın nedeni yüklediğimiz kısmın name'nin image olması 
  let uploadPath = __dirname + '//../Public/uploads/' + uploadeImage.name; //Yüklenen fotoğraflar Public klasöründe uploads dosyası oluşturur ve içine yüklenir, uploadeImage.name ise dosyanın adı oluşturulur
  //uploads'ın sağına  / işareti koymazsak dosya yolunu bulamaz
  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name, //görselin yolunu bildirdik ,sonradan veritabına kaydetmek için
    });
    res.redirect('/');
  });
};