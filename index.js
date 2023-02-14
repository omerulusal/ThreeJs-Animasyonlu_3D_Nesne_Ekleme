const gunesTexture = new THREE.TextureLoader().load('gunes.jpg');
function init() {
    const scene = new THREE.Scene();
    // scene ile sahne oluşturdum.
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(5, 0, 5);
    //kameranın XYZ eksenindeki pozisyonu belirttim
    camera.lookAt(0, 0, 0);
    //Kameranın bakış açısını tam orta olarak belirttim.
    const renderer = new THREE.WebGLRenderer();
    //Görüntüleme işlemi yapılması için oluşturdum.
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setSize ile ekranın tamamını kaplasın dedim.
    renderer.setClearColor(new THREE.Color(0xAADDff));
    document.body.appendChild(renderer.domElement);
    //DOMda Görünmesi için yazdım.
    //*****-----*****-------IŞIKLAR-----*****-----****----***---
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);//ışık sahneye eklendi.
    const dLight = new THREE.DirectionalLight(0xffffff, 3);
    dLight.position.set(100, 20, 10);
    scene.add(dLight);
    const slight = new THREE.SpotLight(0xffffff);
    slight.position.set(1, 20, 100);
    scene.add(slight);
    //*****-----*****-------YÖN KONTROLÜ-----*****-----****----***---
    const orbit = new THREE.OrbitControls(camera, renderer.domElement);
    //orbit adlı değişkene Orbit yön kontrol methodunu atadım.
    orbit.update();

    //*****-----*****-------GUNES-----*****-----****----****----
    const textureLoader = new THREE.TextureLoader();
    //EBEVYN ELEMENTİM OLAN GÜNEŞİ OLUŞTURDUM
    const gunesGeo = new THREE.SphereGeometry(1, 20, 100);
    const gunesMat = new THREE.MeshBasicMaterial({
        map: gunesTexture
    });
    const gunes = new THREE.Mesh(gunesGeo, gunesMat);
    gunes.position.set(-9, 6, -70);
    scene.add(gunes);

    //*****-----*****-------NESNE-----*****-----****----****----
    let mixer;
    const loader = new THREE.GLTFLoader();
    //nesnemi yüklemek için GLTFLoader oluşturdum ve loader değişkenine atadım
    loader.load(
        'kus.glb',
        //kus nesnesini çağırdım.
        (gltf) => {
            scene.add(gltf.scene);
            //kusu sahneye ekledim
            const model = gltf.scene;
            mixer = new THREE.AnimationMixer(model);
            //sahnedeki kusun AnimationMixer ile animasyon ozelligini aktif ettim
            const clips = gltf.animations;
            //kusun animasyonlarını clips değişkenine atadım

            const clip = THREE.AnimationClip.findByName(clips, 'fly1_bird');
            //fly1_bird adına sahip olan klibi bulup clip değişkenine atadım.
            // fly1_bird (kusun animasyonun adı (threejs editorde görebilirsin))
            const action = mixer.clipAction(clip);
            action.play();
        },
        (abc) => {
            console.log(`${(abc.loaded / abc.total * 100)}% loaded`);
            //consol normalde hata mesajı verecekti, hata yerine bu mesajı yazdı.
        },
        (error) => {
            console.error('Hata Olustu', error);
        },
    );

    const clock = new THREE.Clock();
    //*****-----*****-------ANİMASYON-----*****-----****----***---
    function animate() {
        if (mixer)
            mixer.update(clock.getDelta());

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
init();