import {
    BoxGeometry,
    CylinderGeometry,
    Group,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    SphereGeometry,
} from 'three';

/**
 * DEV-ONLY procedural prototype.
 * Enable via localStorage rosewood-procedural=1 (or VITE_ROSEWOOD_ALLOW_PROCEDURAL).
 * Do not polish this BoxGeometry mesh — ship a professional GLB or 360 sequence instead.
 */
export function createPrototypeBuilding({ reduceDetail = false } = {}) {
    const building = new Group();
    building.name = 'rosewood-future-residence';

    const box = new BoxGeometry(1, 1, 1);
    const sphereSeg = reduceDetail ? 5 : 7;
    const sphere = new SphereGeometry(0.18, sphereSeg, reduceDetail ? 4 : 5);
    const trunk = new CylinderGeometry(0.028, 0.042, 0.4, reduceDetail ? 5 : 6);

    // Warm luxury presentation palette — champagne stone, bronze frames, botanical greens.
    const materials = {
        stone: new MeshStandardMaterial({ color: '#e8dfd0', roughness: 0.72, metalness: 0.03 }),
        stoneSoft: new MeshStandardMaterial({ color: '#f0e8da', roughness: 0.74, metalness: 0.02 }),
        stoneDeep: new MeshStandardMaterial({ color: '#d4c4ae', roughness: 0.76, metalness: 0.04 }),
        stoneTaupe: new MeshStandardMaterial({ color: '#c4b5a4', roughness: 0.78, metalness: 0.04 }),
        charcoal: new MeshStandardMaterial({ color: '#2e2a27', roughness: 0.52, metalness: 0.28 }),
        metal: new MeshStandardMaterial({ color: '#4a423c', roughness: 0.34, metalness: 0.58 }),
        bronze: new MeshStandardMaterial({ color: '#5a4a3c', roughness: 0.36, metalness: 0.55 }),
        gold: new MeshStandardMaterial({ color: '#b89a6c', roughness: 0.32, metalness: 0.62 }),
        platform: new MeshStandardMaterial({ color: '#2a2724', roughness: 0.9, metalness: 0.08 }),
        podiumLight: new MeshStandardMaterial({ color: '#e2d6c4', roughness: 0.7, metalness: 0.03 }),
        ground: new MeshStandardMaterial({ color: '#1c1a18', roughness: 0.98, metalness: 0.02 }),
        wood: new MeshStandardMaterial({ color: '#8a623e', roughness: 0.68, metalness: 0.06 }),
        woodWarm: new MeshStandardMaterial({ color: '#a07448', roughness: 0.62, metalness: 0.05 }),
        accent: new MeshStandardMaterial({ color: '#7a2436', roughness: 0.62, metalness: 0.12 }),
        planter: new MeshStandardMaterial({ color: '#3d4a36', roughness: 0.88, metalness: 0.04 }),
        glass: new MeshPhysicalMaterial({
            color: '#6a7380',
            roughness: 0.18,
            metalness: 0.08,
            transparent: true,
            opacity: 0.62,
            clearcoat: 0.55,
            clearcoatRoughness: 0.22,
            reflectivity: 0.38,
            envMapIntensity: 1,
        }),
        glassAlt: new MeshPhysicalMaterial({
            color: '#5c6572',
            roughness: 0.22,
            metalness: 0.06,
            transparent: true,
            opacity: 0.6,
            clearcoat: 0.4,
            clearcoatRoughness: 0.3,
            reflectivity: 0.32,
        }),
        glassWarm: new MeshPhysicalMaterial({
            color: '#7a7268',
            roughness: 0.2,
            metalness: 0.05,
            transparent: true,
            opacity: 0.55,
            clearcoat: 0.5,
            clearcoatRoughness: 0.25,
            reflectivity: 0.3,
        }),
        glassRail: new MeshPhysicalMaterial({
            color: '#c5cdd6',
            roughness: 0.12,
            metalness: 0.15,
            transparent: true,
            opacity: 0.22,
            clearcoat: 0.6,
            clearcoatRoughness: 0.2,
        }),
        interiorDark: new MeshStandardMaterial({ color: '#1a1510', roughness: 1, metalness: 0 }),
        interiorSoft: new MeshStandardMaterial({
            color: '#e2c899',
            emissive: '#e0b878',
            emissiveIntensity: 0.72,
            roughness: 0.88,
            metalness: 0,
        }),
        interiorBright: new MeshStandardMaterial({
            color: '#f0d4a0',
            emissive: '#f0c888',
            emissiveIntensity: 0.95,
            roughness: 0.85,
            metalness: 0,
        }),
        entranceGlow: new MeshStandardMaterial({
            color: '#f0d8a8',
            emissive: '#f2cfa0',
            emissiveIntensity: 0.9,
            roughness: 0.82,
            metalness: 0,
        }),
        foliageA: new MeshStandardMaterial({ color: '#4f6b42', roughness: 0.92, metalness: 0 }),
        foliageB: new MeshStandardMaterial({ color: '#3a5234', roughness: 0.92, metalness: 0 }),
        foliageC: new MeshStandardMaterial({ color: '#6a7f4e', roughness: 0.9, metalness: 0 }),
        foliageFresh: new MeshStandardMaterial({ color: '#5d8a52', roughness: 0.9, metalness: 0 }),
        soil: new MeshStandardMaterial({ color: '#3a322a', roughness: 1, metalness: 0 }),
    };

    const matrix = new Matrix4();

    function addBox(size, position, material, parent = building) {
        const mesh = new Mesh(box, material);
        mesh.scale.set(size[0], size[1], size[2]);
        mesh.position.set(position[0], position[1], position[2]);
        parent.add(mesh);
        return mesh;
    }

    function addInstances(geometry, material, items, parent = building) {
        if (!items.length) return;
        const mesh = new InstancedMesh(geometry, material, items.length);
        items.forEach(([size, position], index) => {
            matrix.makeScale(size[0], size[1], size[2]).setPosition(position[0], position[1], position[2]);
            mesh.setMatrixAt(index, matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        parent.add(mesh);
    }

    /** Organic low-poly foliage cluster (spheres only — no cone trees). */
    function addFoliageCluster(x, y, z, scale = 1, material = materials.foliageA) {
        const layers = reduceDetail ? 2 : 3;
        for (let i = 0; i < layers; i++) {
            const leaf = new Mesh(sphere, material);
            const sx = scale * (0.85 + (i % 2) * 0.25);
            const sy = scale * (0.55 + i * 0.12);
            const sz = scale * (0.8 + ((i + 1) % 2) * 0.2);
            leaf.scale.set(sx, sy, sz);
            leaf.position.set(
                x + (i - 1) * 0.07 * scale,
                y + i * 0.08 * scale,
                z + ((i % 2) - 0.5) * 0.08 * scale,
            );
            building.add(leaf);
        }
    }

    function addSmallTree(x, y, z, scale = 1) {
        const stem = new Mesh(trunk, materials.wood);
        stem.scale.set(scale, scale * 1.15, scale);
        stem.position.set(x, y + 0.12 * scale, z);
        building.add(stem);
        addFoliageCluster(x, y + 0.32 * scale, z, scale * 1.15, materials.foliageA);
        addFoliageCluster(x + 0.1 * scale, y + 0.22 * scale, z - 0.06 * scale, scale * 0.75, materials.foliageC);
        if (!reduceDetail) {
            addFoliageCluster(x - 0.08 * scale, y + 0.26 * scale, z + 0.07 * scale, scale * 0.65, materials.foliageB);
        }
    }

    // ——— Massing constants (illustrative only) ———
    const floors = 11;
    const floorH = 0.82;
    const slabT = 0.055;
    const towerW = 3.55;
    const towerD = 2.85;
    const coreW = 0.92;
    const balcony = 0.52;
    const podiumTop = 1.55;
    const towerBaseY = podiumTop + 0.08;
    const bodyH = floors * floorH;
    const towerTopY = towerBaseY + bodyH;

    // ——— Podium: light stone body, dark trim, warmer entry ———
    addBox([9.8, 0.04, 7.4], [0, 0.03, 0.04], materials.ground);
    addBox([7.8, 0.12, 5.3], [0, 0.12, 0.06], materials.platform);
    addBox([6.5, 1.05, 4.4], [0, 0.72, 0.08], materials.podiumLight);
    addBox([6.55, 0.08, 4.45], [0, 0.22, 0.08], materials.bronze);
    addBox([5.95, 0.09, 4.0], [0, 1.3, 0.1], materials.stoneSoft);
    addBox([5.5, 0.18, 3.7], [0, 1.45, 0.1], materials.stone);

    // Entrance recess + wood + warm glow + gold edge + tiny Rosewood accent
    addBox([2.1, 0.95, 0.45], [0.55, 0.9, 2.2], materials.charcoal);
    addBox([1.85, 0.82, 0.05], [0.55, 0.9, 2.02], materials.woodWarm);
    addBox([1.5, 0.07, 0.7], [0.55, 1.42, 2.4], materials.wood);
    addBox([1.52, 0.02, 0.08], [0.55, 1.46, 2.72], materials.gold);
    addBox([1.45, 0.025, 0.08], [0.55, 1.4, 2.68], materials.accent);
    addBox([0.26, 0.16, 0.035], [1.32, 1.0, 2.48], materials.accent);
    addBox([0.82, 0.8, 0.04], [0.55, 0.86, 2.48], materials.glassWarm);
    addBox([0.72, 0.1, 0.03], [0.55, 1.2, 2.5], materials.entranceGlow);
    addBox([0.48, 0.05, 0.48], [0.55, 0.46, 2.42], materials.wood);

    // Soft path / steps (bronze + champagne)
    addBox([2.2, 0.05, 1.15], [0.55, 0.24, 3.05], materials.bronze);
    addBox([1.95, 0.05, 0.5], [0.55, 0.3, 2.82], materials.stoneDeep);

    const podiumPlanters = [
        [[2.4, 0.16, 0.55], [-2.45, 0.72, 1.85]],
        [[1.8, 0.16, 0.5], [2.4, 0.72, 1.7]],
        [[0.55, 0.18, 2.1], [-3.1, 0.72, -0.1]],
        [[0.55, 0.18, 1.7], [3.05, 0.72, 0.15]],
        [[2.0, 0.14, 0.45], [-1.7, 1.1, -1.85]],
        [[1.6, 0.14, 0.42], [1.9, 1.1, -1.75]],
        [[1.1, 0.14, 0.38], [-0.3, 0.42, 2.95]],
        [[0.85, 0.14, 0.35], [1.4, 0.42, 2.9]],
    ];
    addInstances(box, materials.planter, podiumPlanters);
    addInstances(
        box,
        materials.soil,
        podiumPlanters.map(([size, pos]) => [[size[0] - 0.08, 0.08, size[2] - 0.08], [pos[0], pos[1] + 0.08, pos[2]]]),
    );

    // ——— Main tower body ———
    addBox([towerW - coreW, bodyH, towerD], [coreW * 0.45, towerBaseY + bodyH / 2, 0], materials.stoneSoft);
    addBox([coreW, bodyH + 0.18, towerD + 0.12], [-(towerW / 2) + coreW / 2 - 0.02, towerBaseY + bodyH / 2 + 0.06, -0.02], materials.charcoal);
    addBox([0.08, bodyH + 0.1, towerD + 0.02], [-(towerW / 2) + coreW - 0.02, towerBaseY + bodyH / 2, 0], materials.bronze);
    addBox([0.035, bodyH + 0.05, towerD - 0.2], [-(towerW / 2) + coreW + 0.02, towerBaseY + bodyH / 2, 0], materials.gold);
    addBox([towerW - 0.35, floorH * 1.05, towerD - 0.25], [0.05, towerTopY - floorH * 0.35, -0.05], materials.stone);
    addBox([towerW - 0.7, floorH * 0.95, towerD - 0.45], [0.1, towerTopY + floorH * 0.55, -0.08], materials.stoneTaupe);

    const glassItems = [];
    const glassAltItems = [];
    const glassWarmItems = [];
    const darkItems = [];
    const softLitItems = [];
    const brightLitItems = [];
    const railItems = [];
    const slabItems = [];
    const planterStripItems = [];
    const woodSoffitItems = [];
    const frameGoldItems = [];

    // Varied warm interiors — still sparse, more readable as presentation glow.
    const softLit = new Set([2, 5, 9, 12, 16, 20, 24, 28, 31, 35]);
    const brightLit = new Set([4, 11, 18, 27, 33]);
    let moduleIndex = 0;

    for (let floor = 0; floor < floors; floor++) {
        const y = towerBaseY + floor * floorH;
        const inset = floor >= floors - 2 ? 0.12 + (floor - (floors - 2)) * 0.1 : 0;
        const w = towerW - inset * 2;
        const d = towerD - inset * 1.2;
        const cx = inset * 0.15;
        const slabY = y + floorH - slabT / 2;

        slabItems.push([[w + balcony * 1.55, slabT, d + balcony * 0.85], [cx, slabY, balcony * 0.15]]);
        if (floor % 2 === 0) {
            woodSoffitItems.push([[w * 0.55, 0.03, balcony * 0.7], [cx + 0.35, slabY - slabT * 0.7, d / 2 + balcony * 0.28]]);
        }

        const paneW = (w - coreW * 0.35) / 3;
        for (let col = 0; col < 3; col++) {
            const gx = -(w / 2) + coreW * 0.55 + paneW * (col + 0.5) + cx;
            const gz = d / 2 - 0.04;
            const gy = y + floorH * 0.48;
            const gSize = [paneW * 0.9, floorH * 0.78, 0.04];
            const glassBucket = brightLit.has(moduleIndex % 40)
                ? glassWarmItems
                : (moduleIndex % 2 === 0 ? glassItems : glassAltItems);
            glassBucket.push([gSize, [gx, gy, gz]]);
            const key = moduleIndex % 40;
            const interiorTarget = brightLit.has(key)
                ? brightLitItems
                : softLit.has(key)
                    ? softLitItems
                    : darkItems;
            interiorTarget.push([[gSize[0] * 0.92, gSize[1] * 0.92, 0.03], [gx, gy, gz - 0.05]]);
            moduleIndex += 1;
        }

        for (let col = 0; col < 2; col++) {
            const gz = -d / 2 + d * ((col + 1) / 3);
            const gx = w / 2 - 0.04 + cx;
            const gy = y + floorH * 0.48;
            const gSize = [0.04, floorH * 0.78, d * 0.28];
            const glassBucket = softLit.has((moduleIndex + 5) % 40)
                ? glassWarmItems
                : (moduleIndex % 2 === 0 ? glassItems : glassAltItems);
            glassBucket.push([gSize, [gx, gy, gz]]);
            const key = (moduleIndex + 5) % 40;
            const interiorTarget = brightLit.has(key)
                ? brightLitItems
                : softLit.has(key)
                    ? softLitItems
                    : darkItems;
            interiorTarget.push([[0.03, gSize[1] * 0.92, gSize[2] * 0.92], [gx - 0.05, gy, gz]]);
            moduleIndex += 1;
        }

        addBox([0.04, floorH * 0.82, 0.06], [cx - w * 0.08, y + floorH * 0.48, d / 2 + 0.01], materials.bronze);
        addBox([0.04, floorH * 0.82, 0.06], [cx + w * 0.18, y + floorH * 0.48, d / 2 + 0.01], materials.metal);
        if (floor % 3 === 0) {
            frameGoldItems.push([[0.03, floorH * 0.55, 0.04], [cx - w * 0.08, y + floorH * 0.48, d / 2 + 0.03]]);
        }

        railItems.push([[w * 0.92, 0.28, 0.03], [cx, slabY + 0.16, d / 2 + balcony * 0.55]]);
        railItems.push([[0.03, 0.28, d * 0.55], [w / 2 + balcony * 0.35 + cx, slabY + 0.16, balcony * 0.05]]);

        if (floor % 2 === 0 || floor === floors - 1) {
            planterStripItems.push([[w * 0.72, 0.11, 0.22], [cx + 0.1, slabY + 0.08, d / 2 + balcony * 0.32]]);
        }
    }

    addInstances(box, materials.stone, slabItems);
    addInstances(box, materials.woodWarm, woodSoffitItems);
    addInstances(box, materials.glass, glassItems);
    addInstances(box, materials.glassAlt, glassAltItems);
    addInstances(box, materials.glassWarm, glassWarmItems);
    addInstances(box, materials.interiorDark, darkItems);
    addInstances(box, materials.interiorSoft, softLitItems);
    addInstances(box, materials.interiorBright, brightLitItems);
    addInstances(box, materials.glassRail, railItems);
    addInstances(box, materials.planter, planterStripItems);
    addInstances(box, materials.gold, frameGoldItems);
    addInstances(
        box,
        materials.soil,
        planterStripItems.map(([size, pos]) => [[size[0] - 0.06, 0.06, size[2] - 0.05], [pos[0], pos[1] + 0.05, pos[2]]]),
    );

    // ——— Organic lightweight greenery ———
    const shrubItems = [];
    const oliveItems = [];
    const plantBudget = reduceDetail ? 44 : 78;

    function pushShrub(x, y, z, scale = 1, olive = false) {
        if (shrubItems.length + oliveItems.length >= plantBudget) return;
        const target = olive ? oliveItems : shrubItems;
        target.push([[1.2 * scale, 0.68 * scale, 1.1 * scale], [x, y, z]]);
        if (!reduceDetail) {
            target.push([[0.8 * scale, 0.55 * scale, 0.75 * scale], [x + 0.1 * scale, y + 0.06 * scale, z - 0.06 * scale]]);
        }
    }

    [
        [-2.4, 0.9, 1.85], [-2.1, 0.88, 1.7], [-2.65, 0.9, 1.65],
        [2.3, 0.9, 1.65], [2.6, 0.88, 1.8], [2.45, 0.9, 1.5],
        [-3.05, 0.9, -0.35], [-3.0, 0.9, 0.25], [-3.05, 0.9, 0.65],
        [3.0, 0.9, 0], [2.95, 0.9, 0.5], [3.0, 0.9, 0.85],
        [-1.65, 1.25, -1.8], [-1.35, 1.22, -1.9], [1.85, 1.25, -1.7], [2.15, 1.22, -1.8],
        [-0.35, 0.55, 2.95], [0.1, 0.55, 3.05], [1.3, 0.55, 2.9],
        [-0.7, 1.25, -1.9], [0.4, 0.48, 3.15], [1.6, 0.5, 3.0],
    ].forEach(([x, y, z], i) => pushShrub(x, y, z, 0.82 + (i % 3) * 0.12, i % 3 === 0));

    for (let floor = 0; floor < floors; floor += reduceDetail ? 2 : 1) {
        if (floor % 2 !== 0 && floor !== floors - 1 && floor % 3 !== 0) continue;
        const y = towerBaseY + floor * floorH + floorH;
        const inset = floor >= floors - 2 ? 0.12 + (floor - (floors - 2)) * 0.1 : 0;
        const d = towerD - inset * 1.2;
        const w = towerW - inset * 2;
        const count = reduceDetail ? 2 : 4;
        for (let i = 0; i < count; i++) {
            const x = -w * 0.3 + i * (w * 0.22) + 0.12;
            pushShrub(x, y + 0.12, d / 2 + balcony * 0.32, 0.5 + (i % 2) * 0.1, i % 2 === 0);
        }
    }

    addInstances(sphere, materials.foliageA, shrubItems);
    addInstances(sphere, materials.foliageFresh, oliveItems);

    if (!reduceDetail) {
        addSmallTree(-2.55, 0.85, 1.55, 0.95);
        addSmallTree(2.55, 0.85, 1.45, 0.9);
        addSmallTree(-1.9, 1.15, -1.7, 0.8);
    } else {
        addSmallTree(-2.5, 0.85, 1.5, 0.85);
        addSmallTree(2.5, 0.85, 1.4, 0.8);
    }

    // ——— Rooftop garden ———
    const roofY = towerTopY + floorH * 0.85;
    addBox([towerW - 0.55, 0.08, towerD - 0.35], [0.08, roofY, -0.06], materials.stoneSoft);
    addBox([towerW - 0.4, 0.08, towerD - 0.2], [0.08, roofY + 0.07, -0.06], materials.stoneDeep);
    addBox([towerW - 0.25, 0.2, 0.07], [0.08, roofY + 0.2, towerD / 2 - 0.28], materials.stone);
    addBox([towerW - 0.25, 0.2, 0.07], [0.08, roofY + 0.2, -towerD / 2 + 0.12], materials.stone);
    addBox([0.07, 0.2, towerD - 0.3], [towerW / 2 - 0.28, roofY + 0.2, -0.06], materials.stone);
    addBox([0.07, 0.2, towerD - 0.3], [-towerW / 2 + 0.45, roofY + 0.2, -0.06], materials.charcoal);
    addBox([1.5, 0.04, 1.0], [0.3, roofY + 0.5, -0.35], materials.metal);
    addBox([0.04, 0.4, 0.04], [-0.3, roofY + 0.28, 0.05], materials.metal);
    addBox([0.04, 0.4, 0.04], [0.9, roofY + 0.28, 0.05], materials.metal);
    addBox([0.04, 0.4, 0.04], [-0.3, roofY + 0.28, -0.7], materials.metal);
    addBox([0.04, 0.4, 0.04], [0.9, roofY + 0.28, -0.7], materials.metal);
    addBox([1.45, 0.12, 0.42], [-0.7, roofY + 0.14, 0.5], materials.planter);
    addBox([1.15, 0.12, 0.4], [0.9, roofY + 0.14, 0.35], materials.planter);
    addBox([0.95, 0.12, 0.8], [0.05, roofY + 0.14, -0.8], materials.planter);
    addFoliageCluster(-0.85, roofY + 0.3, 0.5, 0.78, materials.foliageFresh);
    addFoliageCluster(-0.5, roofY + 0.28, 0.45, 0.62, materials.foliageA);
    addFoliageCluster(0.95, roofY + 0.3, 0.35, 0.72, materials.foliageC);
    addFoliageCluster(0.55, roofY + 0.27, 0.4, 0.5, materials.foliageB);
    addFoliageCluster(0.2, roofY + 0.28, -0.75, 0.68, materials.foliageFresh);
    addFoliageCluster(-0.15, roofY + 0.26, -0.7, 0.52, materials.foliageA);
    addSmallTree(-0.7, roofY + 0.18, 0.45, 0.95);
    addSmallTree(0.85, roofY + 0.18, 0.3, 1.05);
    addSmallTree(0.05, roofY + 0.18, -0.75, 1.1);

    return building;
}
