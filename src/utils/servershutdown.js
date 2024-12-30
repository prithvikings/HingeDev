const servershutdown=(server)=>{
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server stopped manually');
        process.exit(0);
    });
});
};

module.exports=servershutdown;