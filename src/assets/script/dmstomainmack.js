/* ================================================
	   developer:Rahul.T
	   version: 1.3 
	   SMPR: SMPR-32885
	   DATE: 07/01/2021 
================================================= */  

function mdldmsnavigate(frommdlid,tomdlid,mdlrefno,isbpm) {
try { 
console.log("inside mdldmsnavigate function");

var frommdlid1 =frommdlid;
var tomdlid1 =tomdlid;
var isbpm1 = isbpm;
var mdlrefno1 = mdlrefno;
                opener.dmsnavigation([{
		name: 'mdlrefno',
		value: mdlrefno1
		}, {
		name: 'frommdlid',
		value: frommdlid1
		}, {
		name: 'tomdlid',
		value: tomdlid1
		},
		{
		name: 'isbpm',
		value: isbpm1
		}
		]);
 opener.dashboardCustomGlasspanBlock();

 $(document).ready(function () {
        
            event.preventDefault();
            var goBack = window.open('', 'parent');
            goBack.focus();
    });

console.log("mdldmsnavigate done=========>");
}
catch(err) {
       console.log('==mdldmsnavigate err=='+err);
            getConfirmation();
            
 }
}


function mdldmsnavigatenewtab(frommdlid,tomdlid,mdlrefno,isbpm,newtab) {
try {  
console.log("inside mdldmsnavigate");
console.log("frommdlid"+frommdlid);
console.log("tomdlid"+tomdlid);
console.log("mdlrefno"+mdlrefno);
console.log("isbpm"+isbpm);
console.log("newtab"+newtab);
var frommdlid1 =frommdlid;
var tomdlid1 =tomdlid;
var isbpm1 = isbpm;
var newtab1 = newtab;
var mdlrefno1 = mdlrefno;
                opener.dmsnavigation([{
		name: 'mdlrefno',
		value: mdlrefno1
		}, {
		name: 'frommdlid',
		value: frommdlid1
		}, {
		name: 'tomdlid',
		value: tomdlid1
		},
		{
		name: 'isbpm',
		value: isbpm1
		},
		{
		name: 'newtab',
		value: newtab1
		}
		]);

   opener.opencontextdialogconfirmation();  
	console.log("mdldmsnavigatenewtab done=========>");            
}
catch(err) {
       console.log('==mdldmsnavigatenewtab err=='+err);
            getConfirmation();
            
 }
}


	function getConfirmation() {
          var retVal = confirm("Your login MACK application is closed. kindly Re-login again.");
           if( retVal == true ) {
              var x = window.location.origin;
              window.location.href = x;
              return true;
           } else {
             return false;
		}
         }
