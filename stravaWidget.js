//////////// FILE WITH ATHLETE CARACTERISTIQUES ///////////
let athlete = {};
// insert your client ID on your strava API page (number) //////////
athlete.clientId = INSERTYOURID;
// insert your client secret in your strava API page (string) ///////
athlete.clientSecret = 'INSERTYOURSECRET';
///// Iinsert your refresh token in your strava API page (string) ////////
athlete.refreshToken = "INSERTYOURREFERSHTOKEN";
///////// insert your athlete id (number) to find it go to strava.com login and goes to myprofile page you will find your ID in the URL, its different from your clientId on the API page which is your application ID requesting the API this is your athlete account ID //////////
let athleteId = YOURATHLETEID;


log(athlete);

/////// COLORS. VARIABLES.  /////////

let stravaOrange = new Color('FC6100', 1);
let whi = Color.white();
let yearDistance;
let yearElevation;
let phrase;
let activitiesCount;

//////// CREATE BASE  WIDGET  ////////

let wi = new ListWidget();
let avenirFont = new Font('Avenir-book', 8);
//let space = wi.addText(" ");
let imageStravaUrl = "https://portsunlightwheelers.co.uk/wp-content/uploads/2016/12/STRAVA-LOGO.png";
let imageStravaReq = new Request(imageStravaUrl);
let imageStrava = await imageStravaReq.loadImage();
let imageW = wi.addImage(imageStrava);
let space = wi.addText(" ");
space.font = avenirFont;

////////////// REFRESH WIDGET WITH REFRESH TOKEN METHOD ////////////

async function refreshToken()
{
   let req = new Request("https://www.strava.com/api/v3/oauth/token");
  req.method="post"
    req.headers = {
    "Content-Type": "application/json"
    }

  req.body= JSON.stringify({
    client_id:athlete.clientId,
    client_secret:athlete.clientSecret,
    refresh_token:athlete.refreshToken,
    grant_type:"refresh_token"
  })

  let out = await req.loadJSON()
    log(out)
    
  athlete.accessToken = out.access_token;
  athlete.refreshToken = out.refresh_token;
//   file.expiresAt = out.expires_at
//   log(file)
  getStats();  
  createWidget();
        
}
refreshToken();


////// GET STRAVA DATA WITH API ///////////////

async function getStats(){     
  let stravaUrl = `https://www.strava.com/api/v3/athletes/${athleteId}/stats`; 
  let myHeaders = {'Authorization': `Bearer ${athlete.accessToken}`};    
  let stravaData = new Request(stravaUrl);    
  stravaData.headers = myHeaders;    
  let dataRaw = await stravaData.loadJSON();    
  log(dataRaw);
  
  yearDistance = Math.floor((dataRaw.ytd_ride_totals.distance)/1000);  
  yearElevation =   dataRaw.ytd_ride_totals.elevation_gain;  
  activitiesCount = dataRaw.ytd_ride_totals.count;  
  phrase = yearDistance + " km roulés et " + yearElevation + " m d'ascencion en " + activitiesCount + " activités";  
  log(phrase);  
  createWidget(phrase);
}

////// INSERT DATA INTO WIDGET /////////

function createWidget(p){
  let paragraf = wi.addText(p);  
  wi.backgroundColor = stravaOrange;  
  paragraf.textColor = whi;
  Script.setWidget(wi);
}
 
