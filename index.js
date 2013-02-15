var skin = require('minecraft-skin');

module.exports = function (game) {
    var mountPoint;
    var possessed;
    
    return function (img) {
        var player = skin(game.THREE, img).createPlayerObject();
        var physics = game.makePhysical(player);
        
        player.position.set(0, 562, -20);
        game.scene.add(player);
        game.addItem(physics);
        
        physics.yaw = player;
        physics.pitch = player.head;
        physics.subjectTo(new game.THREE.Vector3(0, -0.00009, 0));
        physics.blocksCreation = true;
        
        game.control(physics);
        
        physics.move = function (x, y, z) {
            var xyz = parseXYZ(x, y, z);
            physics.yaw.position.x += xyz.x;
            physics.yaw.position.y += xyz.y;
            physics.yaw.position.z += xyz.z;
        };
        
        physics.moveTo = function (x, y, z) {
            var xyz = parseXYZ(x, y, z);
            physics.yaw.position.x = xyz.x;
            physics.yaw.position.y = xyz.y;
            physics.yaw.position.z = xyz.z;
        };
        
        var pov = 1;
        physics.pov = function (type) {
            if (type === 'first' || type === 1) {
                pov = 1;
            }
            else if (type === 'third' || type === 3) {
                pov = 3;
            }
            physics.possess();
        };
        
        physics.toggle = function () {
            physics.pov(pov === 1 ? 3 : 1);
        };
        
        physics.possess = function () {
            if (possessed) possessed.remove(game.camera);
            var key = pov === 1 ? 'cameraInside' : 'cameraOutside';
            player[key].add(game.camera);
            possessed = player[key];
        };
        
        physics.position = physics.yaw.position;
        
        return physics;
    }
};

function parseXYZ (x, y, z) {
    if (typeof x === 'object') {
        return physics.move(x.x || x[0], x.y || x[1], x.z || x[2])
    }
    return { x: Number(x), y: Number(y), z: Number(z) };
}
