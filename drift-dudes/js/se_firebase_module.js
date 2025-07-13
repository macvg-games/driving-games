  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
  import { signOut, getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,signInWithRedirect  } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
  import { doc, getFirestore, collection, addDoc, getDocs, query, where, limit, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBxNLF_2WfaMRFHyOFh2aprfRqQrgNpSu8",
    authDomain: "drift-dudes.firebaseapp.com",
    projectId: "drift-dudes",
    storageBucket: "drift-dudes.appspot.com",
    messagingSenderId: "1049176572753",
    appId: "1:1049176572753:web:6a1ce481bcb2f0a3ed8970",
    measurementId: "G-RPBQF0KWBL"
  };

  // Initialize Firebase
  const FirebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(FirebaseApp);
  const db = getFirestore(FirebaseApp);


window.Auth_UpdateScore =  function() { UpdateScore();};
async function UpdateScore()
  {

    var ThisUserCustomName = window.document.getElementById('LoginUserName').value;
    if (ThisUserCustomName.length<2) return;

    const UserRef  = await collection(db, "users");
    const q = await query(UserRef, where("auth.uid", "==", window.AccountUid), limit(1));
    const querySnapshot = await getDocs(q);

    var DateNow = new Date();
    var DaysSinceEpoch = DateNow/86400000;

    querySnapshot.forEach((MyDoc) =>
      {
        updateDoc(doc(db, "users", MyDoc.id), {
          "statistics.GamePlayed": (window.AccountGamePlayed*1),
          "statistics.AveragePlacement": (window.AccountAveragePlacement*1),
          "statistics.DaysSinceEpoch": (DaysSinceEpoch*1),
          "statistics.AccountCoins": (window.AccountCoins*1),
          "statistics.AccountSaveString": "Save"+window.AccountSaveString,
          "statistics.totalPoints": (window.AccountTotalPoints*1)});
      });

      setTimeout(function() { GetScores(); }, 2000);
  }


window.Auth_UpdateUserName =  function() { UpdateUserName();};

async function UpdateUserName()
{

  if (window.ConnectedToAccount == false) return;

  var ThisUserCustomName = window.document.getElementById('LoginUserName').value;
  if (ThisUserCustomName.length<2) return;


  const UserRef  = await collection(db, "users");
  const q = await query(UserRef, where("auth.uid", "==", window.AccountUid), limit(1));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((MyDoc) =>
    {
      updateDoc(doc(db, "users", MyDoc.id), { "auth.displayName": ThisUserCustomName, "auth.iconURL": ""+window.AccountIcon });
    });

    setTimeout(function() { GetScores(); }, 2000);
}


async function UpdateUser()
{



  const UserRef  = await collection(db, "users");
  const q = await query(UserRef, where("auth.uid", "==", window.AccountUid), limit(1));
  const querySnapshot = await getDocs(q);

  window.AccountFirstLogin = true;
  var UpdateLogin = false;

  // Look if player is aready in database
  querySnapshot.forEach((doc) =>
    {
     window.AccountFirstLogin = false;
     window.AccountTotalPoints = doc.data().statistics.totalPoints*1;
     window.AccountCoins = doc.data().statistics.AccountCoins*1;
     if (isNaN(window.AccountCoins)) window.AccountCoins = 0;

     window.AccountGamePlayed = doc.data().statistics.GamePlayed*1;
     if (window.AccountGamePlayed === NaN) window.AccountGamePlayed = 0;
     if (window.AccountGamePlayed != window.AccountGamePlayed*1) window.AccountGamePlayed = 0;

     window.AccountAveragePlacement = doc.data().statistics.AveragePlacement*1;
     if (window.AccountAveragePlacement === NaN) window.AccountAveragePlacement = 0;
     if (window.AccountAveragePlacement != window.AccountAveragePlacement*1) window.AccountAveragePlacement = 0;

     window.AccountloadString = "";
     try
     {
       window.AccountloadString  = doc.data().statistics.AccountSaveString;
     }
     catch (e) {}


     if (doc.data().auth.displayName !=null)
     {
     window.AccountName = doc.data().auth.displayName;
     window.AccountRealName = doc.data().auth.displayName;
     }

    else
    {
      window.AccountName = "GUEST";
      window.AccountRealName = "GUEST";
    }



    window.AccountIcon = "resources/login/guest.png";
    if (doc.data().auth.iconURL !="" && doc.data().auth.iconURL !=null)  window.AccountIcon = doc.data().auth.iconURL;


    console.log("+++++++++++++++++++++++++++++++++");
    console.log(doc.data().auth);
    console.log("+++++++++++++++++++++++++++++++++");
    console.log(window.AccountDefaultIcon);
    console.log("+++++++++++++++++++++++++++++++++");


    });

    console.log("AccountUid",window.AccountUid);

    // If User not in database we create it
    if ( window.AccountFirstLogin == true)
    {

      window.AccountName = window.AccountRealName;
      window.AccountCoins = 4;

      if (AccountFirstLogin==true )
      window.AccountIcon = window.AccountDefaultIcon;
      else
      window.AccountIcon = "resources/login/guest.png";

        try
        {
          const Now = Date.now();
          const docRef = await addDoc(collection(db, "users"),
            {
              auth:
                {
                  createdAt: Now,
                  displayName: window.AccountName,
                  lastLoginAt: Now,
                  uid: window.AccountUid,
                  iconURL: window.AccountIcon
                },

              statistics:
                {
                  totalPoints: 0,
                  GamePlayed: 0,
                  AveragePlacement: 0,
                  AccountCoins: 50

                }
            }
            );

            console.log("Document written with ID: ", docRef.id);
        } catch (e) { console.error("Error adding document: ", e); }
    }




    window.updateConnectIcon();
    setTimeout(function() {  window.updateConnectIcon(); }, 250);



}

window.Auth_GetScores =  function() { GetScores(); }

async function GetScores()
{

  var DateNow = new Date();
  var DaysSinceEpoch = (DateNow/86400000)+8;



  window.HiScores = [];
  //const querySnapshot = await getDocs(collection(db, "users"));
  const UserRef  = await collection(db, "users");
  var q;
if (window.HiScoreScope==0)
  q = await query(UserRef, orderBy ("statistics.totalPoints","desc"), limit(10));
  else
  q = await query(UserRef, where ("statistics.DaysSinceEpoch","<",DaysSinceEpoch), orderBy ("statistics.DaysSinceEpoch","desc"), limit(10));



  const querySnapshot = await getDocs(q);

  //console.log(querySnapshot);
  var Rank = 1;
  var LowestHiScorePoints = 9999 ;
  querySnapshot.forEach((doc) =>
    {
      try
      {

        window.HiScores.push({
          displayName:doc.data().auth.displayName,
          totalPoints:doc.data().statistics.totalPoints*1,
          iconURL:doc.data().auth.iconURL});

          if (window.HiScoreScope==0)
          if (doc.data().statistics.totalPoints == window.AccountTotalPoints*1) window.AccountRank = Rank;

          LowestHiScorePoints = doc.data().statistics.totalPoints*1;


      }catch (e) {}

      Rank++;
    });

      // define rank using lowest hiscore and virtual 15000 users
      try
      {

        if (window.HiScoreScope==0)
        if (window.AccountTotalPoints*1 < LowestHiScorePoints*1)
        {
          window.AccountRank = Math.floor(20000 * (LowestHiScorePoints*1-window.AccountTotalPoints*1)/(LowestHiScorePoints*1)   );
        }
      }
      catch (e) {}
          console.log("Rank", window.AccountRank);


  // Lets Order our Table
  for (var i = 0; i< window.HiScores.length; i++)
  for (var j = 0; j< window.HiScores.length; j++)
  {
    if (window.HiScores[i].totalPoints > window.HiScores[j].totalPoints)
    {
      var displayName_a   = HiScores[i].displayName;
      var totalPoints_a   = HiScores[i].totalPoints;
      var iconURL_a       = HiScores[i].iconURL;
      var displayName_b   = HiScores[j].displayName;
      var totalPoints_b   = HiScores[j].totalPoints;
      var iconURL_b       = HiScores[j].iconURL;

      HiScores[i].displayName = displayName_b;
      HiScores[i].totalPoints = totalPoints_b;
      HiScores[i].iconURL = iconURL_b;

      HiScores[j].displayName = displayName_a;
      HiScores[j].totalPoints = totalPoints_a;
      HiScores[j].iconURL = iconURL_a;
    }
  }


}


  // detect auth stat
  onAuthStateChanged (auth, user=>
  {
    if (user!= null)
    {
      console.log('logged in !');
      console.log(user);

      if (user.displayName !=null)
      {
      window.AccountName = user.displayName;
      window.AccountRealName = user.displayName;
      }

     else
     {
       window.AccountName = "GUEST";
       window.AccountRealName = "GUEST";
     }

     window.AccountIcon = "resources/login/guest.png";
     if (user.photoURL !=null || user.photoURL !="" ) window.AccountIcon = user.photoURL;
     if (user.iconURL  !=null || user.iconURL  !="" ) window.AccountIcon = user.iconURL;
     if (user.photoURL !=null || user.photoURL !="" ) window.AccountDefaultIcon = user.photoURL;

     if (window.AccountIcon == "resources/login/guest.png")
     if (user.photoURL !=null || user.photoURL !="" ) window.AccountIcon = user.photoURL;



      window.AccountUid = user.uid;
      window.ConnectedToAccount = true;
      window.Login_CloseWindow();
      window.updateConnectIcon();
      Login_CheckLoged();
      UpdateUser();
      GetScores();

    }
    else
    {
      console.log('No User');
      window.AccountName = "Guest";
      window.AccountIcon = "resources/login/guest.png";
      window.AccountDefaultIcon = "resources/login/guest.png";
      window.AccountUid = "GuestUID";
      window.AccountTotalPoints = 0;
      window.AccountRank = 9999;
      window.ConnectedToAccount = false;
      window.updateConnectIcon();
      Login_CheckLoged();
      // window.Login_OpenWindow()
      // H2 Fixed
      window.Login_CloseWindow();
    }
  }
  );

// Disconnect
window.Auth_Disconnect =  function() {       window.ConnectedToAccount = false;  signOut(auth); }

// Connect with google
window.Auth_Connect_Google =  function()
{
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider).then((result) => {

    // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;

  // The signed-in user info.
  const user = result.user;
  //console.log(user);


  // ...
  }).catch((error) => {

    // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log(errorMessage);

  // The email of the user's account used.
  const email = error.email;

  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
  });
}




// Connect with Facebook
window.Auth_Connect_Facebook =  function()
{
  const provider = new FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });


  signInWithPopup(auth, provider).then((result) => {

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    console.log(user);

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    console.log(error);
    console.log(errorCode);
    console.log(errorMessage);
    console.log(email);
    console.log(credential);

    if (errorCode === 'auth/account-exists-with-different-credential')
    {
      const Try_provider = new GoogleAuthProvider();
      signInWithRedirect(auth, Try_provider);
    }

    // ...
  });

}


// Connect with Facebook
window.Auth_Connect_Guest =  function()
{

  signInAnonymously(auth)
  .then((result) => {
    // Signed in..
        // The signed-in user info.
       // const user = result.user;
        console.log(result);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
  });


}