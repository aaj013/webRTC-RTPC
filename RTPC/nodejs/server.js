var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var POST={};
	req.on('data', function(data) {
        data = data.toString();
        data = data.split('&');
        for (var i = 0; i < data.length; i++) {
            var _data = data[i].split("=");
            POST[_data[0]] = _data[1];
        }
		var fs = require('fs');

		var type=""+POST['type'];
		var command=""+POST['command'];
		var content=""+POST['content'];		
		var name=""+POST['name'];
		name=decodeURIComponent(name);
		content=decodeURIComponent(content);
		content=decodeURIComponent(content);
		var response=null;
		if(command=="write"){
            		if(type=='file'){
				fs.writeFile(name, content, function(err) {
					if(err) 
        				response="error: file cannot be written.";    		
					else
    					response="success: file '"+name+"' is created or replaced !";
    				res.end(response);
				}); 
			}
			else if(type=='folder'){
				var mkdirp = require('mkdirp');
				mkdirp(name, function(err) {
					if(err) 
        				response="error: folder cannot be created.";    		
					else
    					response="success: folder '"+name+"' is created or replaced !";
    				res.end(response);

				});
			}
			else{
				response="error: invalid write request to server";
				res.end(response);
			}
		}
		else if(command=="read"){
			if(type=="file"){
				fs.readFile(name, 'utf8', function (err,data) {
  					if (err) 
    					response="error : file could not be read.";
    				else	
  					response=data;
   				res.end(response);
  			
 				});
			}
			else{
				response="error: invalid read request to server";
				res.end(response);
			}
		}
		else if(command=="delete"){
			if(type=="file"){
				fs.unlink(name, 
					function(err){
						if(err)
							response="error: file could not be deleted";
						else
							response="file '"+name+"' deleted successfully";
					res.end(response);
					});
			}
			else if(type=="folder"){
				fs.unlink(name, 
					function(err){
						if(err)
							response="error: folder could not be deleted";
						else
							response="folder '"+name+"' deleted successfully";
					res.end(response);
				});
			}
			else{
				response="error: invalid delete request";
				res.end(response);

			}
		}
		else if(command=="rename"){
			if(type=="folder"){
				fs.renameSync(name,content);
				response="folder '"+name+"' renamed successfully";
                                res.end(response);
				
			}	
			else if(type=="file"){
				fs.renameSync(name,content);
				response="folder '"+name+"' renamed successfully";
                                res.end(response);

			}
			else{
				response="error: invalid delete request";				
				res.end(response);

			}
		}
	});

}).listen(8000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8000/');
