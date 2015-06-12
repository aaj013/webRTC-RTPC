
/*---variable declarations---*/

var appKey = 'tsvftd9pn32wewmi';
var peer = {ID:null,obj:null,conn:[],
    initID:
    function(ID,button){
        if(ID.trim()){
            button.disabled=true;
            peer.ID=ID;
            obj=new Peer(peer.ID,{key:appKey});
            obj.on('open', 
            function() {
                console.log('my peer ID : ' + peer.ID);
            });
            obj.on('connection', 
            function(connect) {
                connect.on('data',
                function(data){
                     console.log('recieved : '+data);
                });
            });
        }
        else
            console.log("error : empty sender ID !");
    },
    send:
    function(type,msg,otherID){  
        console.log('sending message...'+peer.findPeerByID(otherID));
        peer.conn[0]=obj.connect(otherID);      
        peer.conn[0].on('open',
        function(){
            peer.conn[0].send('{ from:'+peer.ID+',to:'+otherID+',type:'+type+',content:'+msg+'}');
            console.log('"' +msg+ '"'+' sent to: ' + otherID);
        });
    },
    findPeerByID:
    function(ID){
        for(i=0;i<peer.conn.length;++i){
            console.log(peer.conn[i]);
            if(peer.conn[i].peer==ID)
                return true;
        }
        return false;
    }
};






