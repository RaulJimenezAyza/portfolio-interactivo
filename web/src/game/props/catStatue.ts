import * as THREE from "three";

/* The deity on the plaza fountain, ported unchanged from the single-file
 * build. It is the first piece of the scene to move across because it is the
 * shape of everything that follows: a function that returns a Group, and
 * therefore something the registry can swap for a .glb without the caller
 * knowing.
 *
 * A seated cat in stone, about two metres of it, built the way you would rough
 * one out of a block: haunches, chest, head, then the details that make it a
 * cat rather than a bear. The face is cut deeper and darker than anatomy would
 * have it because it has to survive being ten metres away and two up. */
export function buildCatStatue(): THREE.Group {
  const G = new THREE.Group();
  const m = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0, y = 0, z = 0,
    o: { rz?: number; rx?: number; parent?: THREE.Object3D; cast?: boolean } = {}
  ) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    if (o.rz) mesh.rotation.z = o.rz;
    if (o.rx) mesh.rotation.x = o.rx;
    mesh.castShadow = o.cast !== false;
    mesh.receiveShadow = true;
    (o.parent ?? G).add(mesh);
    return mesh;
  };

  /* Paler and warmer than the fountain it stands on, deliberately: carved from
     the same block it disappeared into the basin at any distance. */
  const stone = new THREE.MeshStandardMaterial({ color: 0xb9ac93, roughness: .58, metalness: .06 });
  const stoneW = new THREE.MeshStandardMaterial({ color: 0x9c907a, roughness: .68 });
  const shade = new THREE.MeshStandardMaterial({ color: 0x6b5f4c, roughness: .8 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: .3, metalness: .7 });

  /* pedestal — the origin sits on its underside, per the folder's convention */
  m(new THREE.CylinderGeometry(1.05, 1.2, .22, 20), stoneW, 0, .11, 0);
  m(new THREE.CylinderGeometry(.92, .95, .42, 20), stone, 0, .43, 0);
  m(new THREE.TorusGeometry(.93, .07, 6, 24), stoneW, 0, .64, 0, { rx: Math.PI / 2 });

  const B = .86;                       // everything above sits on the plinth

  /* haunches and rump — one squashed sphere does the whole seated mass */
  m(new THREE.SphereGeometry(.62, 18, 14), stone, 0, B + .34, -.12).scale.set(1, .82, 1.15);
  for (const s of [-1, 1]) {
    m(new THREE.SphereGeometry(.3, 14, 10), stone, s * .42, B + .2, .14).scale.set(.8, .78, 1.35);
    m(new THREE.SphereGeometry(.15, 12, 8), stone, s * .4, B + .1, .58);
  }

  /* chest, tapering up out of the rump */
  m(new THREE.CylinderGeometry(.29, .46, .82, 16), stone, 0, B + .82, .1);
  m(new THREE.SphereGeometry(.31, 16, 12), stone, 0, B + .78, .26).scale.set(1, 1.1, .85);

  /* forelegs, straight down the way a seated cat holds them */
  for (const s of [-1, 1]) {
    m(new THREE.CylinderGeometry(.095, .12, .84, 10), stone, s * .2, B + .38, .38);
    m(new THREE.SphereGeometry(.135, 12, 8), stone, s * .2, B, .46).scale.set(1, .7, 1.3);
  }

  /* head. The parts that say which way this thing is facing get names, for the
     same reason the folder's README lists child names: a .glb that replaces
     this one should be interchangeable with it, and that includes being
     inspectable the same way. */
  m(new THREE.SphereGeometry(.36, 18, 14), stone, 0, B + 1.42, .12).name = "head";
  (G.getObjectByName("head") as THREE.Mesh).scale.set(1, .94, .98);
  const muzzle = m(new THREE.SphereGeometry(.19, 14, 10), stone, 0, B + 1.32, .38);
  muzzle.name = "muzzle";
  muzzle.scale.set(1.2, .82, .95);
  m(new THREE.ConeGeometry(.08, .1, 4), shade, 0, B + 1.37, .54, { rx: -Math.PI / 2 });
  for (const s of [-1, 1]) {
    /* a bare cone reads as a horn; the inner one is what makes it an ear */
    m(new THREE.ConeGeometry(.17, .36, 5), stone, s * .21, B + 1.8, .08, { rz: s * .16 });
    m(new THREE.ConeGeometry(.1, .24, 5), shade, s * .21, B + 1.76, .15, { rz: s * .16 });
    m(new THREE.BoxGeometry(.13, .035, .04), shade, s * .075, B + 1.28, .52, { rz: -s * .3, cast: false });
  }

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xbdfbf0, emissive: new THREE.Color(0x7ce8e0), emissiveIntensity: 1.5, roughness: .22
  });
  const eyes: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    /* a socket behind each eye, or the eye is a bright bead sitting on the
       surface instead of set into the head */
    m(new THREE.SphereGeometry(.105, 10, 8), shade, s * .14, B + 1.47, .32, { cast: false });
    const e = m(new THREE.SphereGeometry(.082, 10, 8), eyeMat, s * .14, B + 1.47, .36, { cast: false });
    e.scale.set(1, 1.3, .75);
    e.name = s < 0 ? "eyeL" : "eyeR";
    eyes.push(e);
  }

  /* collar with a bell — the one warm thing on it */
  m(new THREE.TorusGeometry(.28, .045, 6, 20), gold, 0, B + 1.12, .16, { rx: Math.PI / 2 - .18 });
  m(new THREE.SphereGeometry(.075, 10, 8), gold, 0, B + 1.0, .36);

  /* tail: nine shrinking beads on an arc, which is the only way to get a curve
     with no lathe and no tube geometry */
  for (let i = 0; i < 9; i++) {
    const t = i / 8, a = -.5 + t * 2.5, r = .62 + t * .26;
    m(new THREE.SphereGeometry(.115 - t * .045, 10, 8), stone,
      Math.sin(a) * r * .95, B + .1 + t * t * .5, Math.cos(a) * r * .8 - .1);
  }

  /* The eyes pulse and blink. That is the whole trick that keeps a grey statue
     from disappearing into a grey fountain at dusk — so it travels with the
     model rather than living in the scene that mounts it. */
  G.userData.tick = (t: number) => {
    eyeMat.emissiveIntensity = 1.25 + Math.sin(t * 1.35) * .5;
    const blink = 1 - Math.max(0, Math.sin(t * .7 + 1.2) - .96) * 22;
    for (const e of eyes) e.scale.y = 1.3 * blink;
  };
  return G;
}
