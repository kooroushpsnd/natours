const Tour = require('./../models/tourModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async(req ,res ,next) => {
  const tours = await Tour.find()

  res.status(200).render('overview' ,{
    title : 'All Tours',
    tours
  })
})

exports.getTour = catchAsync(async(req ,res ,next) => {
  const tour = await Tour.findOne({slug : req.params.slug}).populate({
    path : 'reviews',
    fields : 'review rating user'
  })

  if(!tour) next (new AppError(404 ,'There is no tour with that name'))

  res.status(200).render('tour' ,{
    title : `${tour.name} Tour`,
    tour
  })
})

exports.getLoginForm = (req ,res ,next) => {
  res.status(200).render('login' ,{
    title : 'Log into your account'
  }) 
}

exports.getAccount = (req ,res) => {
  res.status(200).render('account' ,{
    title : 'Your account'
  }) 
}

exports.updateUserData = catchAsync(async(req,res,next) => {
  const user = await User.findByIdAndUpdate(req.user.id ,{
    name : req.body.name,
    email : req.body.email
  },{
    new : true,
    runValidators : true
  })
  res.status(200).render('account' ,{
    title : 'Your account',
    user
  }) 
})