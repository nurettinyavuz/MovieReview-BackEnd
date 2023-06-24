const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    //try-catch yapmamızın nedeni hatayı yakalamak içi
    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      //Hatalı request gönderilirse dönecek
      //Oluşturulan yeni kursu template'e göndermiyoruz json dosyasında saklıyacaağız
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req,res)=>{
  try{
    const {email,password}=req.body;//İstek gövdesinden gelen email ve password değerlerini çıkartıyoruz.(Kullanıcıdan veriyi aldığımız kısım)
    const user = await User.findOne({email}); // Kullanıcıdan aldığınız email değeriyle, veritabanında User modelindeki email alanı eşleşen bir kullanıcı belgesini bulmak için
    if(!user){
      res.status(400).send('BÖYLE BİR KULLANICI BULUNAMADI');
    }
    const same = await compare(password , user.password);
    if(same){
      req.session.userID = user._id; //Yukarıda tanımladığımız user'ın id'sini userID'ye atayacağız (Her kullanıcının farklı ıd'si vardı bu da o)(Hangi kullanıcının giriş işlemi yaptığını ayıt edebiliriz)
      res.status(200).redirect('/');
    }
  }catch(error){
    res.status(400).json({
      status:'fail',
      error,
    })
  }
  
}