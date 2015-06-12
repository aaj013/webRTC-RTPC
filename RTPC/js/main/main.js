

var appKey='tsvftd9pn32wewmi';
function Group(ID,groupID){
	this.ID=[];
	this.ID.push(ID);
	this.groupID=groupID;
}

	function cancelRequest1(){
		var selectbox=document.getElementById("group-users");
		var popup=document.getElementById('popup');
		var req=document.getElementById('req-button');
		var cancel=document.getElementById('cancel-button');
		selectbox.style.visibility="hidden";
		popup.style.visibility="hidden";
		req.style.visibility="hidden";
		cancel.style.visibility="hidden";
		
	}



function  addMessage1(text,fromID){
		root=document.getElementById('msg-container');
			var name=document.createElement("div");
			name.innerHTML=fromID+":";
			name.style["font-size"]="15px";
			var child=document.createElement("div");
			child.innerHTML=text;
			child.style.border="1px solid black";
			child.style.padding="2px";
			child.style.margin="2px";
			child.style["word-wrap"]="break-word";
			child.style["font-size"]="14px";
			color="#d35400";
			child.style.background=color;
			child.style.color="white";
			child.style["font-size"]="14px";
			root.setAttribute("class","test");
			root.appendChild(name);	
			root.appendChild(child);
//			console.log();
	}





	function addUser1(name){
		var root=document.getElementById('chat-list');
					console.log("adding ");

		if(name){
			console.log("adding inside");
			var child=document.createElement("div");
			child.innerHTML=name;
			child.style.border="1px solid black";
			child.style["word-wrap"]="break-word";
			child.style.color="white";

			child.style.background="#1abc9c";
			$(child).hover(
  				function () {
    				$(this).css("background", "#16a085");
  				},
  				function () {
    				$(this).css("background", "#1abc9c");
  				}
			);
			child.style.padding="3px";
			child.style.margin="5px";
			child.addEventListener("click",openChatBox);
			child.style["font-size"]="14px";
			root.appendChild(child);
		}
	}
	
	
	function openChatBox(event){
		var source = event.target || event.srcElement;
		var chatbox=document.getElementById("chat-box");
		var user=document.getElementById("user-name");
		user.innerHTML=source.innerHTML;
		chatbox.style.visibility="visible";

	}	
		
	
function Message(from,broker,to,group,type,content){
	this.from=from;
	this.broker=broker;
	this.to=to;
	this.group=group;
	this.content=content;
	this.type=type;
	this.time=new Date();		
}
function groupToJSON(group){
	return JSON.stringify(group);
}
function messageToJSON(message){
	return JSON.stringify(message);
}
function groupToJSONArray(group){
	var groupArray=[];
	groupArray.push(group);	
	return groupArray;

}
var peerJSON={
	/*peer object*/
	peer:null,
	mediaConn:null,
	/*type of messages*/
	REQUEST:'request',
	REPLY:'reply',
	FREQUEST:"filereq",
	FPOSACK:"fileposack",
	FNEGACK:"filenegack",
	GREQUEST:"groupreq",
	GPOSACK:"groupposack",
	GNEGACK:"groupnegack",
	BROADCAST:'broadcast',
	CHAT:'chat',			
	VIDEOPACK:'videoposack',
	VIDEONACK:'videonegack',
	NACK:'negativeack',
	PACK:'positiveack',
	TABLE:'table',
	/*different groups or rooms*/		
	group:[],					
	/*getter for a particular group id*/



	getGroup:function(groupID){
		for (var i = 0; i < peerJSON.group.length; i++) 
			if(peerJSON.group[i].groupID==groupID)
				return peerJSON.group[i];
			return null;
		},



		getAssocGroupsOf:function(id){
			var subgroup=[];
			for(i=0;i<peerJSON.group.length;++i){
				group=peerJSON.group[i];
				if(peerJSON.isMember(id,group)){
					subgroup.push(group)
				}								
			}
			return subgroup;
		},





		/*checking whether a member is already in a group*/
		isMember:function(ID,group){
	//		console.log("types:"+typeof(group.ID));
			for(i=0;i<group.ID.length;++i)
				if(group.ID[i]==ID)
					return true;
				return false;
			},


			/*get selected group*/
			getCurrentGroupID:function(){
		//		return document.getElementById('group_id').value;
				selectbox=document.getElementById("select-group");
				value=selectbox.value;
				console.log("selected group:"+value);
				return value;
			},


			/*add member into a specific group*/
			addMember:function(ID,groupID){

				var group=peerJSON.getGroup(groupID);
				var status='status: ';
				if(group!=null){
					status+='added member "'+ID+'"  to the existing group "'+group.groupID+'"';
					console.log(status);
					group.ID.push(ID);
				}
				else{
					peerJSON.group.push(new Group(ID,groupID));							
					status+='created new group "'+groupID+'" and  added member "'+ID+'"';
					console.log(status);
				}
			},


			/*list all the groups and it members*/
			showGroups:function(){
				var status;
				if(peerJSON.group.length==0)
					status='status: no active groups.'
				else
					status='status: following are the groups:'
				console.log(status);
				for (var i = 0; i < peerJSON.group.length; i++){ 
					status='group :'+peerJSON.group[i].groupID;
					console.log(status);
					for(var j=0;j<peerJSON.group[i].ID.length;++j)
						console.log('['+peerJSON.group[i].ID[j]+']')
				}
			},

			closeCall:function(){
				peerJSON.mediaConn.close();
			},
			/*video call to another peer*/
			makeCall:function(toID){
				navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				console.log("got permission");
				navigator.getMedia({video: true,audio: true},
					function(stream) {
						var call = peerJSON.peer.call(toID, stream);
						peerJSON.mediaConn=call;
						othervideo=document.getElementById('othervideo');
						call.on('stream', function(otherstream){
							othervideo=document.getElementById('othervideo');
							if (navigator.mozGetUserMedia) {
								othervideo.mozSrcObject = otherstream;
							} else {
								var vendorURL = window.URL || window.webkitURL;
								othervideo.src = vendorURL.createObjectURL(otherstream);
							}
							othervideo.play();      
						});
						video=document.getElementById('myvideo');      							
						if (navigator.mozGetUserMedia) {
							video.mozSrcObject = stream;
				
						} else {
							var vendorURL = window.URL || window.webkitURL;
							video.src = vendorURL.createObjectURL(stream);
						}
				//		video.play();
					},
					function(err) {
						console.log("An error occured! " + err);
					}
					);

			},


			/*handle a message from another peer */
			handleMsg:
			function(msgJSON){
				var status='';
				var res=document.getElementById('notification');
				if(msgJSON.type==peerJSON.CHAT){
						//addmsg(msgJSON.content);
						res.innerHTML="Recieved msg from "+msgJSON.from;
						addMessage1(msgJSON.content,msgJSON.from);
				}
				else if(msgJSON.type==peerJSON.FREQUEST){
					var res=document.getElementById("notification");
					res.innerHTML="File Request from "+msgJSON.from;
					if(confirm("Accept file request from "+msgJSON.from+" ?")){
						var root=document.getElementById("root-name").innerHTML;
						console.log("recvd:"+msgJSON.content);
						var json=JSON.parse(msgJSON.content);
						var filePath=json.filePath.replace(json.root,root);
						$.post("http://localhost:8000",{"name":filePath,"content":"","command":"read",type:"file"}, function(data){     
		    				console.log("recieved: "+data);
		    				var file=new Object();
		    				file.path=json.filePath;
		    				file.content=data;
							peerJSON.sendMsg(JSON.stringify(file),peerJSON.FPOSACK,msgJSON.from,msgJSON.group);
		    			});
					}
				}
				else if(msgJSON.type==peerJSON.FPOSACK){
					var res=document.getElementById("notification");
					res.innerHTML="File Content recieved from "+msgJSON.from;
					var fileData=JSON.parse(msgJSON.content);
						$.post("http://localhost:8000",{"name":fileData.path,"content":fileData.content,"command":"write",type:"file"}, function(data){     
		    				console.log("recieved: "+data);
		    		});
				}
				else if(msgJSON.type==peerJSON.GREQUEST){
					if(confirm("Accept Project Request from "+msgJSON.from+" ?")){
						var root=document.getElementById("root-name").innerHTML;
						$.post("http://localhost:8000",{"name":root+"/"+msgJSON.group+"/"+msgJSON.group+".json","content":"","command":"read",type:"file"}, function(data){     
		    				console.log("recieved: "+data);
							peerJSON.sendMsg(data,peerJSON.GPOSACK,msgJSON.from,msgJSON.group);
		    			});
					}
					else
						peerJSON.sendMsg("unidentified peer",peerJSON.GNEGACK,msgJSON.from,msgJSON.group);

				}
				else if(msgJSON.type==peerJSON.GPOSACK){
					var root=document.getElementById("root-name").innerHTML;
					console.log(msgJSON.content);
							var fexp=JSON.parse(msgJSON.content);
							var regex = new RegExp(fexp.core.data[0].id,"g");
							console.log("replacing ");
    						var replace = msgJSON.content.replace(regex,root+"/"+msgJSON.group);
		    				console.log("recieved: "+msgJSON.content);
		    				console.log("replaced: "+replace);

					$.post("http://localhost:8000",{"name":root+"/"+msgJSON.group+"/"+msgJSON.group+".json","content":replace,"command":"write","type":"file"}, function(data){     
		    				console.log("written");
		    				json=JSON.parse(replace);
		    				for(i=1;i<json.core.data.length;++i){

		    					var type;
		    					if(json.core.data[i].icon=="images/fileico.png")
		    						type="file";
		    					else
		    						type="folder";
		    						$.post("http://localhost:8000",{"name":json.core.data[i].id,"content":"","command":"write","type":type}, function(data){     
			    						console.log("recieved: "+data);
		    						});
		    				}

		    				$('#wrapper').jstree("destroy");
							$('#wrapper').jstree(JSON.parse(replace));
							cancelRequest1();
						//	$('#popup').style.visibility="visible";


		    		});
				}
				else if(msgJSON.type==peerJSON.GNEGACK){
					var res=document.getElementById("notification");
					res.innerHTML="Group request rejected by "+msgJSON.from;
				}
				else if(msgJSON.type==peerJSON.REQUEST){
					status='status: recieved request';
					status+=messageToJSON(msgJSON);
					console.log(status);
					if(!peerJSON.isMember(msgJSON.from,peerJSON.getGroup(msgJSON.group)))		
						if (confirm('Accept request from  "'+ msgJSON.from+'" having groupID "'+msgJSON.group+' " ') == true) {
							addUser1(msgJSON.from);
						
							status='status: request accepted ';
							console.log(status);
							status='status: ';									
							var table=msgJSON.content;
							peerJSON.addMember(msgJSON.from,msgJSON.group);
							peerJSON.sendMsg(groupToJSONArray(peerJSON.getGroup(msgJSON.group)),peerJSON.PACK,msgJSON.from,msgJSON.group);


							for (var i in table[0].ID){
								id=table[0].ID[i];
								if(id!=msgJSON.from&&id!=msgJSON.to){
									if(!peerJSON.isMember(id,peerJSON.getGroup(msgJSON.group)))
										peerJSON.sendMsg(groupToJSONArray(peerJSON.getGroup(msgJSON.group)),peerJSON.BROADCAST,id,msgJSON.group);					
								}
							}

						}
						else{
							status='status: request discarded ';
							peerJSON.sendMsg('unidentified peer',peerJSON.NACK,msgJSON.from,peerJSON.getCurrentGroupID());
							status+=messageToJSON(msgJSON);

							console.log(status);
						}
					}	        

					else if(msgJSON.type==peerJSON.PACK){
						status='status: got positive reply  ';
						status+=messageToJSON(msgJSON);
						console.log(status);        	             
						res.innerHTML="Request from "+msgJSON.from+" is accepted.";

						if(!peerJSON.isMember(msgJSON.from,peerJSON.getGroup(msgJSON.group))){
							peerJSON.addMember(msgJSON.from,msgJSON.group);
							addUser1(msgJSON.from);

							var table=msgJSON.content;
							for (var i in table[0].ID){
								id=table[0].ID[i];
								if(id!=msgJSON.from&&id!=msgJSON.to){
									if(!peerJSON.isMember(id,peerJSON.getGroup(msgJSON.group)))
										peerJSON.sendMsg(groupToJSONArray(peerJSON.getGroup(msgJSON.group)),peerJSON.BROADCAST,id,msgJSON.group);
								}						
							}
						}
					}

					else if(msgJSON.type==peerJSON.NACK){
						status='status: remote peer  rejected your request  ';								
						status+=messageToJSON(msgJSON);
						res.innerHTML="Request from "+msgJSON.from+" is rejected.";
						console.log(status);
					}
					else if(msgJSON.type==peerJSON.BROADCAST){
						status='status: recieved broadcast  ';
						status+=messageToJSON(msgJSON);
						if(!peerJSON.isMember(msgJSON.from,peerJSON.getGroup(msgJSON.group)))
							if (confirm('Accept Broadcast request from  "'+ msgJSON.from+'" having groupID "'+msgJSON.group+' " ') == true) {
								res.innerHTML="Accepted broadcast request from "+msgJSON.from;

								status='status: (BROADCAST) request accepted';
								console.log(status);        	             					
								
								addUser1(msgJSON.from);

								
								
								peerJSON.addMember(msgJSON.from,msgJSON.group);
								peerJSON.sendMsg(groupToJSONArray(peerJSON.getGroup(msgJSON.group)),peerJSON.PACK,msgJSON.from,msgJSON.group);  			   							
								var table=msgJSON.content;
								for (var i in table[0].ID){
									id=table[0].ID[i];
									if(id!=msgJSON.from&&id!=msgJSON.to){
										if(!peerJSON.isMember(id,peerJSON.getGroup(msgJSON.group)))
											peerJSON.sendMsg(groupToJSONArray(peerJSON.getGroup(msgJSON.group)),peerJSON.BROADCAST,id,msgJSON.group);
									}						
								}

							}
						}

					}
					,
					
					
					/*initialises peer*/
					createPeer:
					function (ID){
						var res=document.getElementById('notification');						
						var status=null;
						if(peerJSON.peer==null)
						if(ID!=null){
							ID=ID.trim();
							if(ID){
								var button=document.getElementById("logout");
								button.disabled=true;
								var spinner=document.getElementById("spinner");
								var popup=document.getElementById('popup');
								popup.style.visibility="visible";
								spinner.style.visibility="visible";

								status="status: initialising peer using id: "+ID;
								console.log(status);
								res.innerHTML="Initialising peer using id: "+ID;
								peerJSON.peer=new Peer(ID,{key:appKey});
								peerJSON.peer.on('open', 
									function() {
										status='status: peer created  using id: ' + ID;

										console.log(status);
										var res=document.getElementById('notification');						
										var welcome=document.getElementById('welcome');						
										var popup=document.getElementById('popup');
										var spinner=document.getElementById('spinner');
										popup.style.visibility="hidden";
										spinner.style.visibility="hidden";
								//		var button=document.getElementById("logout");
								//		button.disabled=false;
								//		button.value="Disconnect";
										res.innerHTML="Welcome " +peerJSON.peer.id;
										welcome.innerHTML="Welcome " +peerJSON.peer.id;
//										peerJSON.addMember(ID,groupID);  
								//		var label=document.getElementById("welcome");
							//			.innerHTML=="Welcome "+peerJSON.peer.id;
							
									}
									);
								peerJSON.peer.on('connection', 
									function(connect) {
										connect.on('data',
											function(data){
												msgJSON=JSON.parse(data);
												peerJSON.handleMsg(msgJSON);                    
											}
											);
									}
									);
								peerJSON.peer.on('call',
									function(call){
										peerJSON.mediaConn=call;
										var res=document.getElementById("notification");
										console.log(peerJSON.peer.id+" has  recieved a call");

										res.innerHTML="You have recieved a call";
										if(confirm("Answer call ?")){

										call.on('stream',
											function(otherstream){

												othervideo=document.getElementById('othervideo');
												if (navigator.mozGetUserMedia) 
													othervideo.mozSrcObject = otherstream;
												else {
													var vendorURL = window.URL || window.webkitURL;
													othervideo.src = vendorURL.createObjectURL(otherstream);
												}
												othervideo.play();      
											}
											);					      
										navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
										navigator.getMedia({video: true,audio: false},
											function(stream) {
													call.answer(stream);      								
													video=document.getElementById('myvideo');
													if (navigator.mozGetUserMedia) 
														video.mozSrcObject = stream;
													else {
														var vendorURL = window.URL || window.webkitURL;
														video.src = vendorURL.createObjectURL(stream);
													}
												//	video.play();
												
											},
											function(err) {
												console.log("An error occured! " + err);
											}
											);				      
										}
									}
									);
peerJSON.peer.on('disconnected',
	function(){
		status='status: peer is disconnected .';
		if(!peerJSON.peer.destroyed)
			peerJSON.peer.destroy();
		res.innerHTML=status;
		console.log(status);									

	});
peerJSON.peer.on('error',
	function(err) {
		status='status : '+err;
		res.innerHTML=status;
		console.log(status);
	}
	);	
peerJSON.peer.on('close',
	function() {
		status='status: peer is closed.';
		var connect=document.getElementById("logout");
		connect.value="Connect";
		connect.disabled=false;							
		res.innerHTML=status;
		console.log(status); 										
	}
	);
}
else{
	status='status: peer could not be created using empty group id.';
	console.log(status);		
}
}
else{
	status='status: peer could not be created using empty id.';
	console.log(status);		
}

}


/*destroys peer object*/
,destroyPeer:
function(){
	if(peerJSON.peer!=null){
		peerJSON.peer.destroy();
		status="status: peer is destroyed";
		console.log(status);
	}
}

,broadcastMsg:
function(content,type,groupID){
	var group=peerJSON.getGroup(groupID);
	for(i in group.ID)
		if(group.ID[i]!=peerJSON.peer.id)	
			sendMsg(content,type,group.ID[i],groupID);
}
/*sending message to another group*/
,sendMsg:
function  (content,type,toID,groupID){
	if(true){
		var res=document.getElementById('notification');
		var status=null;
		status='status: sending message to ' +toID+' ...';
		res.innerHTML="Sending message to "+toID+' ...';
		console.log(status);
		var con=peerJSON.peer.connect(toID);      
		con.on('open',
			function(){
				var message=new Message(peerJSON.peer.id,peerJSON.peer.id,toID,groupID,type,content);
				var messageJSON=messageToJSON(message);		
				status='status: sent request '+ messageJSON;
				res.innerHTML="Message is sent to "+toID;
				con.send(messageJSON);
				console.log(status);
			}
			);
		con.on('error',
			function(err) {
				status='status: '+err;
				res.innerHTML=status;
				console.log(status);
			}
			);	
	}
	else{
		status='status: empty message content';
		console.log(status);
	}

},
};
