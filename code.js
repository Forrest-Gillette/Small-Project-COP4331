const urlBase = 'http://www.cop4331c-13.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function Register()
{
	let newUserUsername = document.getElementById("newUserLoginName").value;
	let newUserPassword = document.getElementById("newUserLoginPassword").value;
	let newUserFirstName = document.getElementById("newUserFirst").value;
	let newUserLastName = document.getElementById("newUserLast").value;
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {FirstName:newUserFirstName, LastName:newUserLastName, Login:newUserUsername, Password:newUserPassword};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("loginResult").innerHTML = "Successfully registered";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
	
}

function ContactCreate()
{
	let newContactName = document.getElementById("nameCreateText").value;
	let newContactPhone = document.getElementById("phoneCreateText").value;
	let newContactEmail = document.getElementById("emailCreateText").value;
	document.getElementById("ContactCreateResult").innerHTML = "";

	let tmp = {Name:newContactName, Phone:newContactPhone, Email:newContactEmail, UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/ContactCreate.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("ContactCreateResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("ContactCreateResult").innerHTML = err.message;
	}
	
}

function ContactSearch()
{
	let srch = document.getElementById("nameText").value;
	document.getElementById("ContactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/ContactSearch.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("ContactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for (let i = 0; i < jsonObject.results.length; i++) 
				{
					let contact = jsonObject.results[i];
					if (i == 0)
						contactList += "<table class='table'> <tr class='top-row'> <td>Name</td> <td>Phone Number</td> <td>Email</td> <td>edit/delete</td> </tr>";
					
					contactList += "<tr class='data-rows'>" + "<td class='data-columns'>" + contact.Name + "</td>"+ "<td class='data-columns'>" 
								+ contact.Phone + "</td>" + "<td class='data-columns'>" + contact.Email + "</td>";
					contactList += "<td>" + "<button class='edit-btn' onClick='editContact()'>edit</button>";
  					contactList += 
					"<button class='delete-btn' data-contact-id='" + contact.ID + "' onClick='ContactDelete(" + contact.ID + ")'>Delete</button>"
					+ "</td>" + "</tr><br>";

  					if (i < jsonObject.results.length - 1)
					{
    					contactList += "</table><br />\r\n";
  					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("ContactSearchResult").innerHTML = err.message;
	}	
}

function ContactDelete(contactId) {
  let tmp = { contactId: contactId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/ContactDelete.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("ContactSearchResult").innerHTML = "Contact has been deleted";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("ContactSearchResult").innerHTML = err.message;
  }
  location.reload();
}
