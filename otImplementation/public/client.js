(function () {
  var SocketIOAdapter = ot.SocketIOAdapter;
  var AjaxAdapter = ot.AjaxAdapter;
  var EditorClient = ot.EditorClient;
  var CodeMirrorAdapter = ot.CodeMirrorAdapter;

  var socket;
  var cmClient;
  if (useSocketIO) {
        socket = io.connect('/');
	socket.on('doc', function (obj) {
		initialize(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
       });
  } 
  
  function initialize (str, revision, clients, serverAdapter) {
        cm.setValue(str);
	cmClient = window.cmClient = new EditorClient(revision, clients,serverAdapter, new CodeMirrorAdapter(cm));
	
	var userlist = document.getElementById('userlist');
	userlist.appendChild(cmClient.clientListEl);
	
	cm.on('change', function () {
			if (!cmClient) { return; }
			console.log(cmClient.undoManager.canUndo(), cmClient.undoManager.canRedo());
		});
  }
  /*var askUsername = function( ) {
	  var uname;
	  uname = prompt("Enter your username");
	  if(uname==="" || uname===null) {
		  askUsername();
	  }
	  else
		  return uname;
  }*/
  
  var login;
  if (useSocketIO) {
  login = function (username, callback) {
	  socket.emit('login', { name: username }).on('logged_in', callback);
    };
  }

  var editor = document.getElementById('editor');
  var cm = window.cm = CodeMirror(editor, {
            lineNumbers: true,
	    lineWrapping: true,
  });


  cm.setOption('readOnly', true);
  var loginForm = document.getElementById('login_form');
  loginForm.onsubmit = function (e) {
	  if(e.preventDefault) {
		  e.preventDefault();
	  }
	  var username = document.getElementById('username').value;
	  login(username, function () {
			  var li = document.createElement('li');
			  li.appendChild(document.createTextNode(username));
			  li.setAttribute('style','color:rgb(0,0,0)');
			  cmClient.clientListEl.appendChild(li);
			  cmClient.serverAdapter.ownUserName = username;
			  
			  cm.setOption('readOnly', false);
			  
			  document.getElementById("mysubmit").disabled=true;
			  document.getElementById("username").disabled=true;
		  });
   };

})();
