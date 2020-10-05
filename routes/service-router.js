var express = require('express');
var router = express.Router();
var User = require('../model/User');
var Topic = require('../model/Topic');
var Message = require('../model/Message');
var Notification = require('../model/Notification');
const bcryptjs = require('bcryptjs');
var mongoose = require('mongoose');

/* ======================================================= */
/*                       User                          */
/* ======================================================= */

router.get('/user/:id', (req, res, next) => {
  User.find({_id:req.params.id},{password:0})
  .then((user) => {
    if (user) {     
      res.status(200).json(user[0]);      
    }
    else {
      res.status(201).json({  })
    }
  }).catch(err => {
    res.json(err)
  })
});

router.post('/updateProfile', (req, res, next) => {  
  var id = req.body._id;
  User.findByIdAndUpdate({ _id: id }, req.body)
    .then((User) => {
      if (User) {
        res.status(200).json({ message: 'Updated successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to Update', type: 'error' })
      }
    }).catch(err => {
      res.json(err)
    })

});
router.post('/updateProfileImage', (req, res, next) => {  
  var id = req.body._id;
  if (req.files && Object.keys(req.files).length != 0) {
    var image = req.files.image.name;
    image = new Date().getTime()+'_'+image
    var dir = "./public/images/"+image;
    sampleFile = req.files.image;
    sampleFile.mv(dir, function(err) {
        if (err) return res.status(500).send(err);
    });
   User.findByIdAndUpdate({ _id: id },{image:image})
    .then((User) => {
      if (User) {
        res.status(200).json({ message: 'Profile Image Updated successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to Update', type: 'error' })
      }
    }).catch(err => {
      res.json(err)
    })
  }
});
router.get('/allUser/:type', (req, res, next) => {
  User.find({role:req.params.type},{password:0,createdAt:0})
    .then((user) => {
      if (user) {
        res.status(200).json(user.reverse())
      }
      else {
        res.status(201).json({ message: 'No data found' })
      }
    }).catch(err => {
      res.json(err)
    })
});

/* ======================================================= */
/*                           Topic                         */
/* ======================================================= */

router.post('/addTopic', (req, res, next) => {
  const topic = new Topic(req.body);
  topic.save()
    .then((topic) => {
      if (topic) {
        res.status(200).json({ message: 'Added successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to Add', type: 'error' })
      }
    }).catch(err => {    
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(201).json({message: 'Topic already exist!',type: 'error' });
    }else{ res.json(err) }   
    })
});

router.put('/updateTopic/:topicId', (req, res, next) => {
  Topic.findByIdAndUpdate({ _id:req.params.topicId },req.body)
    .then((topic) => {
      if (topic) {
        res.status(200).json({ message: 'Updated successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to update',  })
      }
    }).catch(err => {
      res.json(err)
    })
});

router.get('/delTopic/:topicId', (req, res, next) => {
  Topic.findByIdAndRemove({ _id: req.params.topicId})
    .then((topic) => {
      if (topic) {
        res.status(200).json({ message: 'Removed successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to Remove', type: 'error' })
      }
    }).catch(err => {
      res.json(err)
    })
});

router.get('/allTopic/:userId', (req, res, next) => {
  Topic.find({userId:req.params.userId})
    .then((topic) => {
      if (topic) {
        res.status(200).json(topic.reverse())
      }
      else {
        res.status(201).json({ message: 'No data found' })
      }
    }).catch(err => {
      res.json(err)
    })
});

router.get('/topicById/:id', (req, res, next) => {
  Topic.find({_id:req.params.id},{scholarId:1,userId:1,name:1,views:1})
  .populate('userId',{username:1,image:1,_id:0,onlinestatus:1})
  .populate('scholarId',{username:1,image:1,onlinestatus:1,country:1})
    .then((topic) => {
      if (topic) {
          res.status(200).json(topic[0]) }
      else {
        res.status(201).json({ message: 'No data found' })
      }
    }).catch(err => {
      res.json(err)
    })
});

/* ======================================================= */
/*                           Message                       */
/* ======================================================= */

router.post('/addMessage', (req, res, next) => {
  const message = new Message(req.body);
  message.save()
    .then((msg) => {
      if (msg) {
        Topic.findByIdAndUpdate({ _id:msg.topicId }, {lastMsgId:mongoose.Types.ObjectId(msg._id),status:true}).then(msg=>{})
        res.status(200).json({ message: 'Added successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to Add', type: 'error' })
      }
    }).catch(err => { 
      console.log(err)   
      res.json(err)
    })
});

router.get('/latestMessage/:role/:userId',  (req, res, next) => {
  let con;
  if(req.params.role=='user'){
    con={ userId: req.params.userId ,status:true}
  }else{
    con={ scholarId: req.params.userId ,status:true}
  }
 
  Topic.find(con, { lastMsgId: 1, name: 1 }).populate({ path: 'lastMsgId', select: 'content createdAt fromId toId status type _id', populate: { path: 'fromId', model: 'user', select: '_id image onlinestatus username' } })
    .then((topic) => {
      console.log(topic)
      if (topic) {   
         res.status(200).json(topic)
      }
      else {
        res.status(201).json({ message: 'No data found' })
      }
    }).catch(err => { 
      res.json(err)
    })
});

// router.get('/delMessage/:id', (req, res, next) => {
//   Message.findByIdAndRemove({ _id:req.params.id })
//     .then((notification) => {
//       if (notification) {
//         res.status(200).json({ message: 'Deleted successfully', type: 'success' })
//       }
//       else {
//         res.status(201).json({ message: 'Unable to delete',  })
//       }
//     }).catch(err => {
//       res.json(err)
//     })
// });

router.get('/allMessage/:topicId',  (req, res, next) => {
  Message.find({topicId:req.params.topicId})
    .then((msg) => {
      if (msg) {         
        res.status(200).json(msg.reverse())
      }
      else {
        res.status(201).json({ message: 'No data found' })
      }
    }).catch(err => {
      res.json(err)
    })
});


router.put('/updateMessage/:topicId/:fromId', (req, res, next) => {
  
  Message.updateMany({topicId:req.params.topicId,fromId:req.params.fromId},req.body)
   .then((msg) => {
    if (msg) {
      res.status(200).json({ message: 'Updated successfully', type: 'success' })
    }
    else {
      res.status(201).json({ message: 'unable to update',  })
    }
  }).catch(err => {
    res.json(err)
  })

});

/* ======================================================= */
/*                           Notification                  */
/* ======================================================= */

router.post('/addNotification', (req, res, next) => {
  const notification = new Notification(req.body);
  notification.save()
    .then((notification) => {
      if (notification) {
        res.status(200).json({ message: 'Added successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to Add', type: 'error' })
      }
    }).catch(err => { res.json(err) })      
});

router.put('/updateNotification/:id', (req, res, next) => {
  Notification.findByIdAndUpdate({ _id:req.params.id },req.body)
    .then((notification) => {
      if (notification) {
        res.status(200).json({ message: 'Updated successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'unable to update',  })
      }
    }).catch(err => {
      res.json(err)
    })
});

router.get('/deleteNotification/:id', (req, res, next) => {
  Notification.findByIdAndRemove({ _id:req.params.id })
    .then((notification) => {
      if (notification) {
        res.status(200).json({ message: 'Deleted successfully', type: 'success' })
      }
      else {
        res.status(201).json({ message: 'Unable to delete',  })
      }
    }).catch(err => {
      res.json(err)
    })
});

router.get('/allNotification', (req, res, next) => {
  Notification.find()
    .then((notification) => {
      if (notification) {
        res.status(200).json(notification.reverse())
      }
      else {
        res.status(201).json({ message: 'No data found' })
      }
    }).catch(err => {
      res.json(err)
    })
});

module.exports = router;
