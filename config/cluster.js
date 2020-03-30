//@Author ismael alves
import app from './server'
import { cpus } from 'os'
import http from 'http'
import cluster from 'cluster'
import Socket from './socket'

class Clusters{

    cpus    

    constructor(){
        this.cpus = cpus();
        this.init()
    }

    init(){
        if(cluster.isMaster){
            this.cpus.forEach(() => cluster.fork())
            cluster.on('exit', ()=>{
                cluster.fork()
            })
        }else{
            this.startApplication()
        }
    }

    startApplication(){
        const server = http.createServer(app);
        const io = new Socket(server).init();
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log(`Servidor em execução na porta ${PORT}`))
    }
}

export default new Clusters()