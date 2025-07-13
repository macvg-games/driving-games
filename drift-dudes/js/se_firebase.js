
var ConnectedToAccount = false;
var AccountRealName = "";
var AccountName = "";
var AccountEmail = "";
var AccountIcon = "resources/login/guest.png";
var AccountDefaultIcon = "resources/login/guest.png";
var AccountUid = "";
var AccountTotalPoints = 0;
var AccountCoins = 15;
var AccountRank = 99999;
var AccountGamePlayed = 0;
var AccountAveragePlacement = 0;
var AccountSaveString = "";
var AccountloadString = "";

var AccountFirstLogin = false;

var HiScores = [];
var HiScoreScope = 0;

function Login_CheckLoged() {
  if ( Trigger_DisableFireBAse == true ) return;

  if (ConnectedToAccount == true) {
    document.getElementById('LoginWindow').style = "display:none;";
    document.getElementById('LoginUserWindow').style = "display:block;";
  }
  else {
    document.getElementById('LoginWindow').style = "display:block;";
    document.getElementById('LoginUserWindow').style = "display:none;";
  }

}

function Login_OpenWindow() {
  if ( Trigger_DisableFireBAse == true ) return;
  Login_CheckLoged();
  var EL = document.getElementById('LoginOverlay');
  LoginOverlay.style = "display:block;";
}



function Login_CloseWindow() {
  var EL = document.getElementById('LoginOverlay');
  LoginOverlay.style = "display:none;";

  // check user Name
  var TempUserName = document.getElementById('LoginUserName').value;
  // if (TempUserName.lenght<2) TempUserName = "Player"+Math.floor((Math.random()*1000));
  document.getElementById('LoginUserName').value = TempUserName;
  AccountName = TempUserName;
  updateConnectIcon();
  Auth_UpdateUserName();
  //Auth_GetScores();
}

function Login_SetAvatar(el) {
  if ( Trigger_DisableFireBAse == true ) return;
  document.getElementById('LoginAvatarWindow').style = "display:none;";
  document.getElementById('LoginUserWindow').style = "display:block;";

  if (el == -1) return;

  AccountIcon = el.getAttribute('src');
  se_savePref('AccountIcon', "" + AccountIcon);
  document.getElementById('LoginUserIcon').src = AccountIcon;

}

function Login_ShowAvatar() {
  if ( Trigger_DisableFireBAse == true ) return;
  document.getElementById('LoginAvatarWindow').style = "display:block;";
  document.getElementById('LoginUserWindow').style = "display:none;";
}


function ConnectDisconnect(Type) {
  if ( Trigger_DisableFireBAse == true ) return;
  if (ConnectedToAccount == false && Type == "google") Auth_Connect_Google();
  if (ConnectedToAccount == false && Type == "facebook") Auth_Connect_Facebook();
  if (ConnectedToAccount == true && Type == "close") Auth_Disconnect();
  if (ConnectedToAccount == false && Type == "guest") Auth_Connect_Guest();
}

function updateConnectIcon() {

  if ( Trigger_DisableFireBAse == true ) return;

  if (ConnectedToAccount == true) {


    // Setup Account Name + length
    if (AccountName != "" && AccountName != null)
    {
        document.getElementById('LoginUserName').value = AccountName;
        Sockets_PlayerName = document.getElementById('LoginUserName').value
        AccountName = document.getElementById('LoginUserName').value
        se_savePref('Sockets_PlayerName', Sockets_PlayerName);
    }

    if (AccountIcon=="null" || AccountIcon==null || AccountIcon == "") AccountIcon = "resources/login/guest.png";
    if (AccountDefaultIcon=="null" || AccountDefaultIcon==null || AccountDefaultIcon == "") AccountDefaultIcon = "resources/login/guest.png";

    document.getElementById('LoginUserIcon').src = AccountIcon;
    document.getElementById('LoginUserAvatar').src = AccountDefaultIcon;


  }
  else {
    //EL.style.backgroundColor = "gray";
    //EL.style.backgroundImage = "";
    //ELn.innerHTML = "Not Logged";
  }

}

