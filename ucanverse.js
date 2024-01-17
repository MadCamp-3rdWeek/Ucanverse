const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const session = require('express-session');



app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(cors()); // 모든 도메인에서의 요청을 허용합니다.
app.use(bodyParser.json());
app.use(express.json());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ucanverse',
  database: 'ucanverse'
});

connection.connect((err) => {
    if (err) {
      console.error('MySQL 연결 실패:', err);
      throw err;
    }
    console.log('MySQL 연결 성공!');
});

// /images/gucci 로 api가 쏴지는 것을 확인하면 미들웨어로 /root/images/gucci 디렉터리 안의 파일들에 접근하게 해주는듯. 
app.use('/images/gucci', express.static('/root/images/gucci'));
app.use('/images/nike', express.static('/root/images/nike'));
app.use('/images/posts', express.static('/root/images/posts'));

app.post('/NavigationLogo', (req,res) => {
  const brandId = req.body.brand_id;
  const query = "SELECT navilogo_url FROM brands WHERE brand_id="+brandId+";";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/customMain', (req,res) => {

  const{brand_id, keyword} =req.body;
  
  const query = 'SELECT SUBSTRING_INDEX(GROUP_CONCAT(img_url), \',\' , 1) as first_img_url, post_id from attachments natural join posts where brand_id = ?  and category= "custom" and (title LIKE ? or contents LIKE ? or user_id LIKE ?) group by post_id order by upload_time desc';

  connection.query(query, [brand_id, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }
    console.log(brand_id);
    console.log(keyword + 'asadd');
  
    console.log('쿼리 결과:as', results);
    // const imageUrlList = results.first_img_url ? results.first_img_url : null;
    res.json({message: results});
  });
});

app.post('/bigprofileimg', (req,res) => {

  const{userId} =req.body;
  console.log('유저 아이디:', userId)
  const query = 'SELECT SUBSTRING_INDEX(GROUP_CONCAT(img_url), \',\' , 1) as first_img_url, posts.post_id from posts LEFT JOIN attachments ON posts.post_id=attachments.post_id where user_id = ?  and category= "custom" group by post_id';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }
  
    //console.log('쿼리 결과:', results);
    // const imageUrlList = results.first_img_url ? results.first_img_url : null;
    res.json({message: results});
  });
});
app.post('/bigprofilelike', (req,res) => {

  const{userId} =req.body;
  console.log('유저 아이디:', userId)
  const query = 'SELECT SUBSTRING_INDEX(GROUP_CONCAT(img_url), \',\' , 1) as first_img_url, post_id from attachments natural join likes where user_id = ? group by post_id';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }
  
    console.log('like 쿼리 결과:', results);
    // const imageUrlList = results.first_img_url ? results.first_img_url : null;
    res.json({message: results});
  });
});


let flag = 'posts';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const tag = req.body.tag;

      // tag에 따라 다른 저장 경로 설정
      let uploadDir = '';
      // if (flag === 'gucci') {
      //     uploadDir = '/root/images/gucci';
      // } else if (flag === 'nike') {
      //     uploadDir = '/root/images/nike';
      // } else {
      //     uploadDir = '/root/images/default'; // 기본 디렉토리
      // }
      uploadDir = '/root/images/posts';

      // 디렉토리가 없으면 생성
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/postCustomPost', upload.single('file'), (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const user_id = req.body.user_id;
  const brand_id = req.body.brand_id;
  const path = `/images/${flag}/${req.file.originalname}`;

  // 0번째 쿼리 실행
const query0 = 'select brand_name from brands where brand_id = ?';
connection.query(query0, brand_id, (err, results0) => {
    if (err) {
        console.error('쿼리 오류:', err);
        res.status(500).json({ error: "서버 오류" });
        return;
    }

    // 결과가 있는지 확인
    if (results0 && results0.length > 0 && results0[0].brand_name) {
        // brand_name을 소문자로 변환하여 flag에 할당
        //flag 반영 실패라 0번째 쿼리 무의미 추후 flag upload에 적용할 필요있음. 
        // flag = results0[0].brand_name.toLowerCase();

        // 첫 번째 쿼리 실행
        const query1 = 'insert into posts(user_id, brand_id, title, contents,upload_time, category) values(?, ?, ?, ?, NOW(), \'custom\')';
        connection.query(query1, [user_id, brand_id, title, description], (err, results1) => {
            if (err) {
                console.error('쿼리 오류:', err);
                res.status(500).json({ error: "서버 오류" });
                return;
            }

            // 결과에서 post_id 추출
            const post_id = results1.insertId;

            // 두 번째 쿼리 실행
            const query2 = 'insert into attachments(post_id, img_url) values (?, ?)';
            connection.query(query2, [post_id, path], (err, results2) => {
                if (err) {
                    console.error('쿼리 오류:', err);
                    res.status(500).json({ error: "서버 오류" });
                    return;
                }

                res.json({ message: "post 및 사진 저장 성공!" });
            });
        });
    } else {
        console.log('Brand Name이 존재하지 않습니다.');
        res.status(500).json({ error: "Brand Name이 존재하지 않습니다." });
    }
});
});

app.post('/postCommunityPost', upload.single('file'), (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const user_id = req.body.user_id;
  const brand_id = req.body.brand_id;
  let path = '';
  if (req.file){
    path = `/images/${flag}/${req.file.originalname}`;
  }
  // 0번째 쿼리 실행
const query0 = 'select brand_name from brands where brand_id = ?';
connection.query(query0, brand_id, (err, results0) => {
    if (err) {
        console.error('쿼리 오류:', err);
        res.status(500).json({ error: "서버 오류" });
        return;
    }

    // 결과가 있는지 확인
    if (results0 && results0.length > 0 && results0[0].brand_name) {
        // brand_name을 소문자로 변환하여 flag에 할당
        //flag 반영 실패라 0번째 쿼리 무의미 추후 flag upload에 적용할 필요있음. 
        // flag = results0[0].brand_name.toLowerCase();

        // 첫 번째 쿼리 실행
        const query1 = 'insert into posts(user_id, brand_id, title, contents, upload_time, category) values(?, ?, ?, ?, NOW(), \'community\')';
        connection.query(query1, [user_id, brand_id, title, description], (err, results1) => {
            if (err) {
                console.error('쿼리 오류:', err);
                res.status(500).json({ error: "서버 오류" });
                return;
            }

            // 결과에서 post_id 추출
            const post_id = results1.insertId;

            // 두 번째 쿼리 실행
            if (req.file){
            const query2 = 'insert into attachments(post_id, img_url) values (?, ?)';
            connection.query(query2, [post_id, path], (err, results2) => {
                if (err) {
                    console.error('쿼리 오류:', err);
                    res.status(500).json({ error: "서버 오류" });
                    return;
                }

                res.json({ message: "post 및 사진 저장 성공!" });
            });}
            else{
              res.json({message: "post 성공!"})
            }
        });
    } else {
        console.log('Brand Name이 존재하지 않습니다.');
        res.status(500).json({ error: "Brand Name이 존재하지 않습니다." });
    }
});
});

app.post ('/checkLikes', (req,res) =>{
  const {user_id, post_id} = req.body;
  const query0 = 'select count(*) as cntLike from likes where user_id= ? and post_id= ?';
  connection.query(query0, [user_id, post_id], (err, results)=>{
    console.log(results[0].cntLike);
  if (err) {
    console.error('쿼리 오류:', err);
    return res.status(500).json({message: '서버 오류'});
  }
  else if (results[0].cntLike == 0){
    const query1 = 'select count(*) as cntLike from likes where post_id = ?';
    connection.query(query1, post_id, (err, results1) =>{
      if (err) {
        console.error('쿼리 오류:', err);
        return res.status(500).json({message: '서버 오류'});
      }
      else{
        console.log("NO");  
        res.json({message: "NO", cnt: results1[0].cntLike});
      }
    })
  }
  else{
    const query2 = 'select count(*) as cntLike from likes where post_id = ?';
    connection.query(query2, post_id, (err, results2) =>{
      if (err) {
        console.error('쿼리 오류:', err);
        return res.status(500).json({message: '서버 오류'});
      }
      else{
        console.log("YES");  
        res.json({message: "YES", cnt: results2[0].cntLike});
      }
    })
  }
  })
});

app.post('/submitLikes', (req,res) =>{
  const {user_id, post_id} = req.body;
  
  const query0 = 'select count(*) as cntLike from likes where user_id= ? and post_id= ?';
  connection.query(query0, [user_id, post_id], (err, results)=>{
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({message: '서버 오류'});
    }
    else if (results[0].cntLike == 0){
      const query1 = 'insert into likes values(?,?)';
      connection.query(query1, [user_id, post_id], (err, results1) => {
        if(err) {
          console.error('쿼리 오류:', err);
          return res.status(500).json({message: '서버 오류'});
        }
        else {
          // 좋아요를 처음해서 추가했을 때 할일
          const query3= 'select count(*) as cntLike from likes where post_id =?';
          connection.query(query3, post_id, (err, results3)=>{
            if (err) {
              console.error('쿼리 오류:', err);
              return res.status(500).json({message: '서버 오류'});
            }
            else {
              res.json({message: "YES", cnt: results3[0].cntLike});
            }
          })
        }
          
          
        })
      }
    else{
      //이미 좋아요를 누른 게시물에 대해 좋아요를 취소
      const query2 = 'delete from likes where user_id= ? and post_id= ?';
      connection.query(query2, [user_id, post_id], (err, results2)=>{
        if (err) {
          console.error('쿼리 오류:', err);
          return res.status(500).json({message: '서버 오류'});
        }
        else {
          //좋아요를 취소했을 때 할일
          const query4= 'select count(*) as cntLike from likes where post_id =?';
          connection.query(query4, post_id, (err, results4)=>{
            if (err) {
              console.error('쿼리 오류:', err);
              return res.status(500).json({message: '서버 오류'});
            }
            else {
          res.json({message: "NO", cnt: results4[0].cntLike});
            }
        })
        }
    })
  }
})
});
  
app.post('/login', (req, res) => {
  const { userId, password } = req.body;

  // Validate inputs
  if (!userId || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력하세요.' });
  }

  // Check user credentials
  const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
  connection.query(query, [userId, password], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length > 0) {
      return res.json({ message: '로그인 성공!', userId });
    } 
    else {
      console.log("로그인 실패!!!!!!", req.session);
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
  });
});

app.post('/bigprofile', (req, res) => {
  const { userId } = req.body;

  // Check user credentials
  const nameQuery = 'SELECT user_name FROM users WHERE user_id = ?';
  const followingQuery = 'SELECT COUNT(*) AS following FROM follow WHERE following_id = ?';
  const followerQuery = 'SELECT COUNT(*) AS follower FROM follow WHERE followed_id = ?';

  // Query to get user_name
  connection.query(nameQuery, [userId], (errName, resultsName) => {
      if (errName) {
          console.error('이름 조회 쿼리 오류:', errName);
          return res.status(500).json({ message: '서버 오류' });
      }

      // If user_name is found
      if (resultsName.length > 0) {
          const userName = resultsName[0].user_name;

          // Query to get following count
          connection.query(followingQuery, [userId], (errFollowing, resultsFollowing) => {
              if (errFollowing) {
                  console.error('팔로잉 조회 쿼리 오류:', errFollowing);
                  return res.status(500).json({ message: '서버 오류' });
              }

              // Query to get follower count
              connection.query(followerQuery, [userId], (errFollower, resultsFollower) => {
                  if (errFollower) {
                      console.error('팔로워 조회 쿼리 오류:', errFollower);
                      return res.status(500).json({ message: '서버 오류' });
                  }

                  const followingCount = resultsFollowing[0].following;
                  const followerCount = resultsFollower[0].follower;

                  console.log(userName, followingCount, followerCount);
                  return res.json({ userName, following: followingCount, follower: followerCount });
              });
          });
      } else {
          // If no user is found with the given userId
          return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  });
});
app.post('/followsearch', (req, res) => {
  const { userId, visitId } = req.body;

  // Check if userId follows visitId
  const query = 'SELECT * FROM follow WHERE following_id = ? AND followed_id = ?';
  connection.query(query, [userId, visitId], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length > 0) {
      // userId is following visitId
      res.json({ isFollowing: true });
    } else {
      // userId is not following visitId
      res.json({ isFollowing: false });
    }
  });
});

app.post('/follow', (req, res) => {
  const { userId, visitId } = req.body;

  // Insert follow data into the 'follow' table
  const query = 'INSERT INTO follow (following_id, followed_id) VALUES (?, ?)';
  connection.query(query, [userId, visitId], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    // 팔로우 성공 시 응답
    res.json({ success: true });
  });
});

app.post('/unfollow', (req, res) => {
  const { userId, visitId } = req.body;

  // Delete follow data from the 'follow' table
  const query = 'DELETE FROM follow WHERE following_id = ? AND followed_id = ?';
  connection.query(query, [userId, visitId], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    // 언팔로우 성공 시 응답
    res.json({ success: true });
  });
});

app.post('/customDescriptionImage', (req,res) => {

  const{post_id} = req.body;
  const query = 'Select img_url from attachments where post_id = ?';
  connection.query(query, post_id, (err, results) =>{
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }

    res.json({message: results});
  });
});

app.post('/customDescriptionExtra', (req,res) => {

  const{post_id} = req.body;
  const query = 'Select user_id, likes, title, contents from posts where post_id = ?';
  connection.query(query, post_id, (err, results) =>{
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }

    res.json({message: results});
  });
});

app.post('/customDescriptionComments', (req,res) => {

  const{post_id} = req.body;
  const query = 'Select user_id, contents from comments where post_id = ?';
  connection.query(query, post_id, (err, results) =>{
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }

    res.json({message: results});
  });
});


app.post('/countFollowers', (req,res) => {

  const {post_id} = req.body; 
  const query = 'with postT as ( select user_id, post_id from posts) select count(following_id) as numFollowers from follow join postT on postT.user_id = follow.followed_id where postT.post_id= ? group by followed_id;';
  connection.query(query, post_id, (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      throw err;
    }
    else {
      // if (results.length === 0){
      //    results.numFollowers= 0;
      // }
      return res.json({message: results})
    }
  })
})


app.post('/signup', (req, res) => {
  const { name, userId, password } = req.body;

  // 입력값 유효성 검사
  if (!name || !userId || !password) {
    return res.status(400).json({ message: '이름, 아이디, 비밀번호를 모두 입력하세요.' });
  }

  // 사용자 ID가 이미 존재하는지 확인
  const checkUserQuery = 'SELECT * FROM users WHERE user_id = ?';
  connection.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 사용자 ID가 고유하면 새로운 사용자 추가
    const insertUserQuery = 'INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)';
    connection.query(insertUserQuery, [userId, password, name], (err, insertResults) => {
      if (err) {
        console.error('쿼리 오류:', err);
        return res.status(500).json({ message: '서버 오류' });
      }

      console.log('회원가입 성공:', insertResults);
      return res.json({ message: '회원가입 성공!' });
    });
  });
});

app.post('/brandsLiked', (req, res) => {
  const userId = req.body.user_id;
  const query = "SELECT brands.* FROM brands LEFT JOIN brandlike ON brands.brand_id = brandlike.brand_id WHERE brandlike.user_id='"+userId+"';";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/brands', (req, res) => {
  const userId = req.body.user_id;
  const query = "SELECT brands.*, COUNT(brandlike.brand_id) AS like_count FROM brands LEFT JOIN brandlike ON brands.brand_id = brandlike.brand_id WHERE NOT EXISTS (SELECT 1 FROM brandlike WHERE user_id = '"+userId+"' AND brand_id = brands.brand_id) GROUP BY brands.brand_id ORDER BY like_count DESC;";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/brandsName', (req, res) => {
  const userId = req.body.user_id;
  const query ="SELECT * FROM brands WHERE NOT EXISTS (SELECT 1 FROM brandlike WHERE user_id = '"+userId+"' AND brand_id = brands.brand_id) ORDER BY brand_name";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/DeleteBrandLike', (req, res) => {
  const userId = req.body.user_id;
  const brandId = req.body.brand_id;
  const query = "DELETE FROM brandlike WHERE user_id='"+userId+"' AND brand_id="+brandId+";";
  connection.query(query, (err) => {
    if (err) throw err;
  });
});

app.post('/InsertBrandLike', (req, res) => {
  const userId = req.body.user_id;
  const brandId = req.body.brand_id;
  const query = "INSERT INTO brandlike VALUES('"+userId+"', "+brandId+");";
  connection.query(query, (err) => {
    if (err) throw err;
  });
});

app.post('/DeletePostLike', (req, res) => {
  const userId = req.body.user_id;
  const postId = req.body.post_id;
  const query1 = "DELETE FROM likes WHERE user_id='"+userId+"' AND post_id="+postId+";";
  const query2 = "UPDATE posts SET likes = likes-1 WHERE post_id ="+postId+";";
  connection.beginTransaction((err) => {
    if (err) throw err;
    connection.query(query1, (err1) => {
      if (err1) {
        return connection.rollback(() => {
          throw err1;
        });
      }
      connection.query(query2, (err2) => {
        if (err2) {
          // 두 번째 쿼리 실패 시 롤백
          return connection.rollback(() => {
            throw err2;
          });
        }

        // 모든 쿼리 성공 시 커밋
        connection.commit((errCommit) => {
          if (errCommit) {
            // 커밋 실패 시 롤백
            return connection.rollback(() => {
              throw errCommit;
            });
          }
          console.log('Transaction Complete.');
        });
      });
    });
  });
});

app.post('/InsertPostLike', (req, res) => {
  const userId = req.body.user_id;
  const postId = req.body.post_id;
  const query1 = "INSERT INTO likes VALUES('"+userId+"', "+postId+");";
  const query2 = "UPDATE posts SET likes = likes+1 WHERE post_id ="+postId+";";
  connection.beginTransaction((err) => {
    if (err) throw err;
    connection.query(query1, (err1) => {
      if (err1) {
        return connection.rollback(() => {
          throw err1;
        });
      }
      connection.query(query2, (err2) => {
        if (err2) {
          // 두 번째 쿼리 실패 시 롤백
          return connection.rollback(() => {
            throw err2;
          });
        }

        // 모든 쿼리 성공 시 커밋
        connection.commit((errCommit) => {
          if (errCommit) {
            // 커밋 실패 시 롤백
            return connection.rollback(() => {
              throw errCommit;
            });
          }
          console.log('Transaction Complete.');
        });
      });
    });
  });
});

app.post('/communityPost', (req, res) => {
  const brandId = req.body.brand_id;
  const query = "SELECT posts.*, attachment_id, user_name FROM posts LEFT JOIN attachments ON posts.post_id = attachments.post_id LEFT JOIN users ON posts.user_id = users.user_id WHERE category ='community' and posts.brand_id="+brandId+" ORDER BY upload_time DESC;";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/communityPostContent', (req, res) => {
  const postId = req.body.post_id;
  const userId = req.body.user_id;
  const query = "SELECT posts.*,  attachments.img_url AS img_url,  users.user_name, CASE WHEN likes.user_id IS NOT NULL THEN 'Liked' ELSE 'Not Liked' END AS user_likes FROM posts  LEFT JOIN attachments ON posts.post_id = attachments.post_id  LEFT JOIN users ON posts.user_id = users.user_id LEFT JOIN likes ON posts.post_id = likes.post_id AND likes.user_id = '"+userId+"' WHERE posts.post_id ="+postId+";";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

//formData를 받을때는 꼭 multer()를 사용해야함. 
const uploadComment = multer();
app.post('/UploadCommentCustom', uploadComment.none(), (req, res) => {
  const comments = req.body.comments;
  const user_id = req.body.user_id;  
  const post_id = req.body.post_id;
  // console.log(comments, user_id, post_id);
  
  const query = "INSERT INTO comments(user_id,post_id,contents,upload_time) VALUES('"+user_id+"',"+post_id+",'"+comments+"',NOW());";

  connection.query(query, (err,results) => {
    if (err) throw err;
    else {
      return res.json({message: results})
    }
  });
});

app.post('/UploadCommentCommunity', (req, res) => {
  const userId = req.body.user_id;
  const postId = req.body.post_id;
  const comments = req.body.comments;
  const query = "INSERT INTO comments(user_id,post_id,contents,upload_time) VALUES('"+userId+"',"+postId+",'"+comments+"',NOW());";

  connection.query(query, (err) => {
    if (err) throw err;
  });
});

app.post('/postComments', (req, res) => {
  const postId = req.body.post_id;
  const query = "SELECT comments.*, user_name FROM comments LEFT JOIN users ON users.user_id=comments.user_id WHERE post_id="+postId+";";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/IncreaseViews', (req, res) => {
  const postId = req.body.post_id;
  const query = "UPDATE posts SET views=views+1 WHERE post_id="+postId+";";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/SearchBrands', (req, res) => {
  const keyword = req.body.keyword;
  const userId = req.body.user_id;
  const query = "SELECT brands.*, EXISTS (SELECT 1 FROM brandlike WHERE user_id = '"+userId+"' AND brand_id = brands.brand_id) AS liked FROM brands WHERE brands.brand_name LIKE '"+keyword+"%' ORDER BY brands.brand_name;";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/SearchPosts', (req, res) => {
  const keyword = req.body.keyword;
  const brandId = req.body.brand_id;
  const category = req.body.category;
  const query = "SELECT posts.*, img_url, user_name FROM posts LEFT JOIN attachments ON posts.post_id = attachments.post_id LEFT JOIN users ON posts.user_id = users.user_id WHERE category ='"+category+"' and posts.brand_id="+brandId+" and (title LIKE '%"+keyword+"%' OR contents LIKE '%"+keyword+"%' OR posts.user_id LIKE '%"+keyword+"%') ORDER BY upload_time DESC;";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.post('/FollowingList', (req, res) => {
  const userId = req.body.user_id;
  const query = "SELECT followed_id FROM follow WHERE following_id='"+userId+"';";

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});


const port = 80;
const host = '0.0.0.0';
app.listen(port, () => {
  console.log(`서버가 http://${host}:${port} 에서 실행 중입니다.`);
});