//@Author ismael alves
import formatMessage from '../utils/messages'
import User from '../utils/users'
import SocketIO from 'socket.io'

const botName = 'ChatCord Bot'
export default class Socket{
    
    io

    constructor(server){
        this.io = SocketIO(server)
    }

    init(){
        // Executar quando o cliente se conectar
        this.io.on('connection', socket => {
            // juntar-se à sala
            this.joinRoom(socket)
            // Lista de menssagens da sala
            this.chatMessage(socket)
            // Executar quando o cliente se desconeta
            this.disconnect(socket) 
        })
    }

    disconnect(socket){
        socket.on('disconnect', () => {
            const user = User.userLeave(socket.id);
            if (user) {
                this.io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} Deixou o bate-papo`)
                );
                // Enviar informações para os usuários da sala
                this.io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: User.getRoomUsers(user.room)
                });
            }
        });
    }

    chatMessage(socket){
        socket.on('chatMessage', msg => {
            const user = User.getCurrentUser(socket.id);
            this.io.to(user.room).emit('message', formatMessage(user.username, msg));
        });
    }
        

    joinRoom(socket){
        socket.on('joinRoom', ({ username, room }) => {
            const user = User.userJoin(socket.id, username, room);
            socket.join(user.room);
        
            // Bem-vindo usuário atual
            socket.emit('message', formatMessage(botName, `Bem-vindo ao ChatCord! ${username}`));
        
            // Transmitir para todos usuários conectados
            socket.broadcast
                .to(user.room)
                .emit(
                'message',
                formatMessage(botName, `${user.username} entrou no chat`)
                );
        
            // Enviar informações para os usuários da sala
            this.io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: User.getRoomUsers(user.room)
            });
        }); 
    }
}