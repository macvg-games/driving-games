var TouchInput = pc.createScript("touchInput");
TouchInput.attributes.add("controlsRoot", {
    type: "entity"
}), TouchInput.attributes.add("overlay", {
    type: "entity"
}), TouchInput.attributes.add("pointerAnchor", {
    type: "entity"
}), TouchInput.attributes.add("vPointer", {
    type: "entity"
}), TouchInput.attributes.add("maxDrag", {
    type: "number"
}), TouchInput.attributes.add("deadZone", {
    type: "number"
}), TouchInput.prototype.initialize = function() {
    this.input = new pc.Vec2(0, 0), this._device = this.app.graphicsDevice;
    this.app.graphicsDevice;
    this.pointer = new pc.Vec2, this.center = new pc.Vec2, this.anchorTouch = null, this.showStick = !1, this.controlsEnabled = !1, null === this.app.touch ? "true" === Helper.params.debug ? (console.log("this device does not support touch. will debug touch control"), this.showStick = !0, this.app.mouse.on(pc.EVENT_MOUSEMOVE, (function(t) {
        this.controlsEnabled && this.dragging && (t.event.stopImmediatePropagation(), this.pointer.set(t.x, t.y))
    }), this), this.app.mouse.on(pc.EVENT_MOUSEUP, (function(t) {
        this.controlsEnabled && this.dragging && (t.event.stopImmediatePropagation(), this.dragging = !1, this.vPointer.setLocalPosition(this.pointerAnchor.getLocalPosition()), this.input.set(0, 0))
    }), this), this.overlay.element.on("mousedown", (function(t) {
        this.controlsEnabled && (t.event.stopImmediatePropagation(), this.pointer.set(t.x, t.y), this.dragging = !0)
    }), this)) : (console.log("this device does not support touch. will do mouse control"), this.showStick = !1, this.controlsRoot.enabled = !1, this.app.mouse.on(pc.EVENT_MOUSEMOVE, (function(t) {
        this.controlsEnabled && (t.event.stopImmediatePropagation(), this.center.set(t.element.clientWidth / 2, t.element.clientHeight / 2), this.pointer.set(t.x, t.y), this.input = this.input.sub2(this.pointer, this.center).normalize(), this.input.set(-this.input.y, this.input.x))
    }), this)) : (console.log("this device does support touch"), this.showStick = !0, this.overlay.element.on(pc.EVENT_TOUCHSTART, this._startDrag, this), this.app.touch.on(pc.EVENT_TOUCHMOVE, this._moveDrag, this), this.app.touch.on(pc.EVENT_TOUCHEND, this._endDrag, this), this.app.touch.on(pc.EVENT_TOUCHCANCEL, this._endDrag, this))
}, TouchInput.prototype.disableControls = function() {
    this.controlsEnabled = !1
}, TouchInput.prototype.enableControls = function() {
    this.controlsEnabled = !0
}, TouchInput.prototype.showControls = function() {
    if (this.showStick)
        for (var t = 0; t < this.controlsRoot.children.length; t++) this.controlsRoot.children[t].script && this.controlsRoot.children[t].script.tween.play()
}, TouchInput.prototype.hideControls = function() {
    for (var t = 0; t < this.controlsRoot.children.length; t++) this.controlsRoot.children[t].element.opacity = 0
}, TouchInput.prototype._startDrag = function(t) {
    if (this.controlsEnabled && !this.dragging) {
        this.anchorTouch = t.touches[0], this.dragging = !0;
        var o = t.touches[0];
        this.pointer.set(o.clientX, o.clientY), void 0 === this.pointer.x && console.error("what")
    }
}, TouchInput.prototype._moveDrag = function(t) {
    if (this.controlsEnabled && this.dragging) {
        var o = t.touches[0];
        this.pointer.set(o.x, o.y), void 0 === this.pointer.x && console.error("what")
    }
}, TouchInput.prototype._endDrag = function(t) {
    if (this.controlsEnabled && this.dragging) {
        if (t.touches.length > 0) {
            for (var o = t.changedTouches, i = !1, e = 0; e < o.length; e++) o[e].identifier === this.anchorTouch.identifier && (i = !0);
            if (!i) return
        }
        this.dragging = !1, this.vPointer.setLocalPosition(this.pointerAnchor.getLocalPosition()), this.input.set(0, 0)
    }
}, TouchInput.prototype.update = function(t) {
    if (this.controlsEnabled && this.dragging) {
        var o = this.app.graphicsDevice,
            i = this.vPointer.element.screen.screen,
            e = (i.scale, o.clientRect.width),
            n = o.clientRect.height,
            s = (i.referenceResolution.x, i.resolution.x, this.pointer.x / e),
            h = this.pointer.y / n,
            r = i.referenceResolution.x,
            c = i.referenceResolution.y,
            p = r / c / (e / n),
            a = this.pointerAnchor.getLocalPosition(),
            u = (s - this.pointerAnchor.element.anchor.x) * r,
            l = (h - (c - this.pointerAnchor.getLocalPosition().y) / c) * c,
            d = new pc.Vec3(1 * u / p, -l, 0),
            g = d.length();
        g > this.maxDrag ? (d.normalize().scale(this.maxDrag), this.vPointer.setLocalPosition(a.x + d.x, a.y + d.y, 0), this.input.set(d.y, d.x).normalize()) : g < this.deadZone ? (this.vPointer.setLocalPosition(this.pointerAnchor.getLocalPosition()), this.input.set(0, 0)) : (this.vPointer.setLocalPosition(a.x + d.x, a.y + d.y, 0), this.input.set(d.y, d.x).normalize()), (Number.isNaN(this.input.x) || Number.isNaN(this.input.y)) && console.error("what")
    }
};
var Helper = {
    ease: {
        out3: function(t) {
            return --t * t * t + 1
        },
        in3: function(t) {
            return t * t * t
        },
        in2: function(t) {
            return t * t
        },
        linear: function(t) {
            return t
        },
        bounce: function(t) {
            return -(2 * t - 1) * (2 * t - 1) + 1
        }
    },
    vec3: {
        dir: function(t, e, r) {
            return (r = r || new pc.Vec3).set(e.x - t.x, e.y - t.y, e.z - t.z), r
        }
    },
    reflect: function(t, e) {
        var r = t.dot(e),
            n = e.clone().scale(2 * r);
        return t.clone().sub(n)
    },
    shuffle: function(t) {
        for (var e, r, n = t.length; 0 !== n;) r = Math.floor(Math.random() * n), e = t[n -= 1], t[n] = t[r], t[r] = e;
        return t
    },
    math: {
        qdot: function(t, e) {
            return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w
        },
        approximately: function(t, e) {
            return Math.abs(t - e) < .001
        },
        _m1: new pc.Vec3,
        _m2: new pc.Vec3,
        clamp: function(t, e, r) {
            return Math.min(Math.max(t, e), r)
        },
        sign: function(t) {
            return this.approximately(t, 0) ? 1 : t / Math.abs(t)
        },
        bezier: function(t, e, r, n, i) {
            return this._m1.lerp(t, e, n), this._m2.lerp(e, r, n), void 0 === i && (i = new pc.Vec3), i.lerp(this._m1, this._m2, n)
        },
        loopAround: function(t, e) {
            return t >= e ? t - e : t
        },
        repeat: function(t, e) {
            return ++t === e && (t = 0), t
        },
        randomInCircle: function(t, e) {
            e = e || new pc.Vec2;
            var r = Math.random() * Math.PI * 2,
                n = t * Math.sqrt(Math.random());
            return e.set(Math.cos(r) * n, Math.sin(r) * n), e
        },
        mod: function(t, e) {
            return t - Math.floor(t / e) * e
        },
        angleDiff: function(t, e) {
            var r = Math.abs(e - t) % 360;
            return r > 180 ? 360 - r : r
        },
        angleDiffSigned: function(t, e) {
            var r = Math.abs(t - e) % 360,
                n = r > 180 ? 360 - r : r;
            return n *= t - e >= 0 && t - e <= 180 || t - e <= -180 && t - e >= -360 ? 1 : -1
        }
    },
    _dat: void 0,
    get dat() {
        return void 0 === this._dat && (this._dat = new dat.GUI, this._dat.close()), this._dat
    },
    _get: function(t) {
        return void 0 === this["_cached_" + t] && (this["_cached_" + t] = pc.app.root.find((function(e) {
            return !!e.script && void 0 !== e.script._scriptsData[t]
        }))[0].script[t]), this["_cached_" + t]
    },
    clearCache: function() {
        var t = [];
        for (var e in this) e.indexOf("_cached_") > -1 && t.push(e);
        for (var r = 0; r < t.length; r++) delete this[t[r]];
        this.dat.destroy(), this._dat = void 0
    },
    get camera() {
        return this._get("camera")
    },
    get game() {
        return this._get("game")
    },
    get hitting() {
        return this._get("hitting")
    },
    get playerE() {
        return this._get("touchInput").entity
    },
    get ai() {
        return this._get("directorAi")
    },
    get pickups() {
        return this._get("directorPickup")
    },
    get level() {
        return this._get("level")
    },
    get pool() {
        return this._get("pool")
    },
    get ftue0() {
        return this._get("ftue0")
    },
    get ftue1() {
        return this._get("ftue1")
    },
    get ftue2() {
        return this._get("ftue2")
    },
    get fonts() {
        return this._get("fonts")
    },
    get compositions() {
        return this._get("compositions")
    },
    get screenResult() {
        return this._get("screenResult")
    },
    get screenProfileMoney() {
        return this._get("screenProfileMoney")
    },
    get screenLevelIndicator() {
        return this._get("screenLevelIndicator")
    },
    get popupUnlock() {
        return this._get("popupUnlock")
    },
    get popupLastChance() {
        return this._get("popupLastChance")
    },
    get popupPause() {
        return this._get("popupIngamePause")
    },
    get tableUnlocking() {
        return this._get("tableUnlocking")
    },
    get shaderFloor() {
        return this._get("shaderFloor")
    },
    getShader: function(t) {
        return Helper._get(t)
    },
    objectHasAnyKey: function(t) {
        for (var e in t) return !0;
        return !1
    },
    _params: void 0,
    get params() {
        if (void 0 === this._params) {
            var t = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (function(e, r, n) {
                t[r] = n
            }));
            this._params = t
        }
        return this._params
    },
    createMaterial: function(t, e, r) {
        var n = pc.app.graphicsDevice,
            i = t.resource,
            a = "precision " + n.precision + " float;\n";
        a += e.resource;
        var o = {
                attributes: {
                    vVertex: pc.SEMANTIC_POSITION,
                    vColor: pc.SEMANTIC_COLOR,
                    vNormal: pc.SEMANTIC_NORMAL,
                    vTexCoord: pc.SEMANTIC_TEXCOORD0
                },
                vshader: i,
                fshader: a
            },
            u = new pc.Shader(n, o),
            c = new pc.Material;
        return c.name = r, c.shader = u, c
    }
};
var PlayerState = {
        RIDING: "riding",
        DESTROYED: "destroyed",
        IDLE: "idle",
        SHOP_IDLE: "shopIdle",
        FTUE0: "ftue0",
        WAITING_RESPAWN: "waitingRespawn",
        WAITING_RESPAWN2: "waitingRespawn2",
        WAITING_RESPAWN3: "waitingRespawn3",
        WAITING_RESPAWN4: "waitingRespawn4"
    },
    PlayerWeapon = {
        SPEAR: "spear"
    },
    Player = pc.createScript("player");
Player.attributes.add("inputLag", {
    type: "number"
}), Player.attributes.add("deadAngle", {
    type: "number"
}), Player.attributes.add("acceleration", {
    type: "vec2"
}), Player.attributes.add("velocity", {
    type: "vec2"
}), Player.attributes.add("steering", {
    type: "vec2"
}), Player.attributes.add("drag", {
    type: "vec2"
}), Player.attributes.add("dragRadius", {
    type: "vec2"
}), Player.attributes.add("tilt", {
    type: "vec2"
}), Player.attributes.add("pingPong", {
    type: "vec2"
}), Player.attributes.add("pingPongSpeed", {
    type: "vec2"
}), Player.attributes.add("hyperSpaceAcc", {
    type: "number"
}), Player.attributes.add("hyperSpaceDecc", {
    type: "number"
}), Player.attributes.add("maxHyperSpaceSpeed", {
    type: "number"
}), Player.attributes.add("hyperSpaceFXColor", {
    type: "rgb"
}), Player.attributes.add("visualLerp", {
    type: "number"
}), Player.attributes.add("visualLerpDropped", {
    type: "number"
}), Player.attributes.add("lanceBunny", {
    type: "entity"
}), Player.attributes.add("deathVingette", {
    type: "entity"
}), Player.attributes.add("respawnCameraTween", {
    type: "number"
}), Player.attributes.add("blobShadow", {
    type: "entity"
}), Player.prototype._keyboard = null, Player.prototype._touch = null, Player.prototype._movingTime = 0, Player.prototype.postInitialize = function() {
    for (var t in this._initialized = !0, this._t = 0, this._inputs = [], this.entity.script) {
        var e = this.entity.script[t];
        if (void 0 !== e.input) {
            var i = e.input;
            void 0 !== i.x && void 0 !== i.y && this._inputs.push(e)
        }
    }
    this._inputs.length, this._state = PlayerState.IDLE, this._time = 0, this._movingTime = 0, this._lastAngle = 0, this._lastVisualAngle = 0, this._lastInputAngle = 0, this._angleBuffer = [], this._sampleCounter = 0, this._lockedRotation = !1, this._lockedDirection = 0, this._speed = this.velocity.x, this._lastQuat = (new pc.Quat).setFromAxisAngle(pc.Vec3.UP, 135), this._lastInputQuat = (new pc.Quat).setFromAxisAngle(pc.Vec3.UP, 135), this.entity.on("collision", this.onCollision, this), this.entity.on("pool_spawn", this.onSpawn, this), this._pingPongDir = -1, this._currentWeapon = PlayerWeapon.SPEAR, this.hyper = !1, this.hyperSpaceAdditional = 0, this.hyperSpaceTime = 0, this.placeOfDeath = new pc.Vec3, this.respawnPoint = null, this.respawnInvincibilityTime = 0, this._ftueDir = -1, "player" === this.entity.script.actor.id && this.entity.script.skinComponent._skin.crown.setLocalScale(0, 0, 0)
}, Player.prototype._startDestroySequence = function() {
    this.hyper ? (this.entity.script.pickupReciever.dropAllSilent(), Helper.pool.spawn("fx_boom_blue", this.entity.getPosition())) : (this.entity.script.pickupReciever.dropAll(), Helper.pool.spawn("fx_boom", this.entity.getPosition())), SFX.playVariance("explosion", this.entity), this.hyperSpaceTime = 0, this.hyper = !1;
    var t = this.entity.script.actor.id;
    if (this.entity.script.skinComponent.detachFromGrid(), this.entity.script.actor.stale = !0, "player" !== this.entity.script.actor.id) this._state = PlayerState.DESTROYED, Helper.ai.removeOne(t), this.entity.script.poolItem.despawn();
    else {
        this.deathVingette.element.opacity = 0, this.entity.script.skinComponent._shader.dissolve = 1, this.entity.script.skinComponent._shader2.dissolve = 1, SFX.switchVolume(0, 0), Helper.game.subtractLife(), 0 === Helper.game.lives ? Helper.popupLastChance.show("life", function() {
            Helper.game.restoreLife(), Helper.game.sessionTimer < 60 && (Helper.game.sessionTimer += 30), this._state = PlayerState.WAITING_RESPAWN, this._time = 0
        }.bind(this), function() {
            this._state = PlayerState.IDLE, Helper.game.endSessionSequence(Locale.get("notify_result_out_of_lives")), Platform.event("session_lost", {
                event_category: "engagement",
                event_label: "out-of-lives",
                ruleset: Helper.game.rules.ruleset,
                level: Inventory.level
            })
        }.bind(this)) : Helper.game.lives > 0 && (this._state = PlayerState.WAITING_RESPAWN, this._time = 0), this.entity.script.skinComponent._skin.lanceRoot.enabled = !1, this.entity.script.skinComponent._skin.turnOffWheels(), this.entity.script.skinComponent._skin.turnOffTrails();
        var e = this.entity.getPosition();
        this.placeOfDeath.set(e.x, e.y, e.z), this.heightOfDeath = Helper.camera._height.value, this.respawnPoint = Helper.level.getPlayerRespawn()
    }
    this.entity.script.powerupNitro.turnOff(), this.entity.script.powerupEnlarger.turnOff(), this.entity.script.powerupSphere.turnOff(), this.entity.script.powerupSmoke.turnOff(), this.entity.script.powerupShooter.turnOff(), this.entity.script.shield.time = 999, this.blobShadow.enabled = !1
}, Player.prototype.onSpawn = function() {
    for (var t in this._state = PlayerState.RIDING, this.entity.script) {
        var e = this.entity.script[t];
        if (void 0 !== e.input) {
            var i = e.input;
            void 0 !== i.x && void 0 !== i.y && this._inputs.push(e)
        }
    }
    0 === this._inputs.length && console.warn(`on actor ${this.entity.script.actor.id} found no inputs`), this.entity.script.skinComponent._skin.crown.setLocalScale(0, 0, 0), this.entity.script.skinComponent.attachToGrid(), Utils.launchEndlessPowerup(this.entity)
}, Player.prototype.onCollision = function(t) {
    var e = "player" === this.entity.script.actor.id,
        i = this.respawnInvincibilityTime > 0,
        s = this.entity.script.shield.active;
    if (e && Helper.camera.shake(), e && Inventory.ftue_death_general < 1 && !Helper.game.notificationInProgress && Helper.game.lives > 1 && (Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("You loose all your ducats", 2, 0, !0, !1).then((function() {
            Helper.game.showNotification2("When you die", 2, 0, !0, !0).then((function() {
                Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
            }))
        })), Inventory.ftue_death_general = 1), t.script.actor.type === ActorType.OBSTACLE && this._startDestroySequence(), t.script.actor.type === ActorType.PLAYER) {
        var n = t.script.shield.active;
        if (s || i) return;
        n && "player" === t.script.actor.id && Helper.game.countFrag(this.entity.script.actor.id), e && Inventory.ftue_death_ram < 3 && !Helper.game.notificationInProgress && Helper.game.lives > 1 && (Helper.game.showNotification2(Locale.get("ftue_fail_ram"), 2, 0), Inventory.ftue_death_ram += 1), this._startDestroySequence()
    }
    if (t.script.actor.type === ActorType.PROJECTILE) {
        if (s || i) return;
        if (!t) throw "aga blyat";
        if (!t.script.actor.owner) throw console.error(t), "nu tak";
        "player" === t.script.actor.owner.script.actor.id && Helper.game.countFrag(this.entity.script.actor.id), this._startDestroySequence()
    }
    if (t.script.actor.type === ActorType.WEAPON) {
        var a = t.script.spear.owner.script.actor.id;
        if (s || i) return;
        "player" === a && (Helper.game.countFrag(this.entity.script.actor.id), Helper.camera.shake()), e && e && Inventory.ftue_death_spear < 3 && !Helper.game.notificationInProgress && Helper.game.lives > 1 && (Helper.game.showNotification2(Locale.get("ftue_fail_spear"), 2, 0), Inventory.ftue_death_spear += 1), this._startDestroySequence()
    }
    t.script.actor.type === ActorType.PINATA && this._startDestroySequence(), t.script.actor.type === ActorType.TRIGGER && t.script.trigger.type === TriggerType.SMOKE && this.entity.script.powerupSmoke.slowdown()
}, Player.prototype.lerpAngle3 = function(t, e, i) {
    var s = "player" === this.entity.script.actor.id,
        n = this.entity.getPosition(),
        a = this.entity.script.skinComponent._skin.rotationRoot.getLocalPosition(),
        r = (new pc.Quat).mul2(i, e.clone().invert()).getEulerAngles(),
        o = Math.abs(r.x + r.y) * Helper.math.sign(r.y),
        p = (Math.abs(r.x + r.y), Helper.math.sign(r.y), o);
    this._lockedRotation ? Math.abs(o) <= this.deadAngle ? (this._lockedDirection = 0, this._lockedRotation = !1) : p = o = this.deadAngle * this._lockedDirection : Math.abs(o) > this.deadAngle && (this._lockedRotation = !0, this._lockedDirection = Helper.math.sign(o));
    var h = Math.min(Math.abs(o) / this.deadAngle, 1);
    this.entity.script.actor.id;
    var l = this._lockedRotation ? this._lockedDirection : Helper.math.sign(r.y),
        c = Helper.ease.in3(h),
        y = (new pc.Quat).setFromAxisAngle(pc.Vec3.BACK, pc.math.lerp(this.tilt.x, this.tilt.y, c) * -l);
    this.entity.script.skinComponent._skin.tiltRoot.setLocalRotation(y);
    var m = pc.math.lerp(this.acceleration.x, this.acceleration.y, h);
    if (Helper.game.state === GameState.COUNTDOWN || this._state === PlayerState.WAITING_RESPAWN3 || this._state === PlayerState.WAITING_RESPAWN4) this._speed = 0;
    else {
        var g, u = this.entity.script.powerupSmoke._slowdownTime > 0 ? .8 : 1;
        if (this._speed = (pc.math.clamp(this._speed + m * t * t, this.velocity.x, this.velocity.y) + this.hyperSpaceAdditional) * u, s)
            if (this.entity.script.powerupSmoke._slowdownTime > 0) SFX.engineCurrent("engine_low");
            else this.hyperSpaceAdditional > 0 ? this._speed <= 20 ? (g = this._speed / 20, SFX.engineCurrent("engine_boosted")) : (g = this._speed / 24.5, SFX.engineCurrent("engine_nitro_boosted")) : this._speed <= 12 ? (g = this._speed / 12, SFX.engineCurrent("engine_normal")) : (SFX.engineCurrent("engine_nitro"), g = this._speed / 16.5), SFX.pitch(1 - (.5 - .5 * g))
    }
    var d = this._speed,
        _ = i.transformVector(pc.Vec3.BACK),
        P = n.clone().add(new pc.Vec3(_.x, 0, _.z).scale(2));
    Gizmo.line(n, P, Gizmo.RED_GIZMO);
    var f = i.clone().transformVector(pc.Vec3.BACK).scale(5);
    this.lanceBunny.setLocalPosition(f), this.entity.script.skinComponent._skin.lanceRoot.lookAt(this.lanceBunny.getPosition());
    var S = 0,
        v = this.entity.script.skinComponent._skin.wheelFx;
    for (S = 0; S < v.length; S++)
        if (this._state !== PlayerState.WAITING_RESPAWN3) {
            var w = v[S].getPosition(); - 1 !== Helper.level._grid.positionToSpatial(w.x, w.z) ? (this.entity.script.powerupNitro._time > 0 && v[S].particlesystem.stop(), v[S].particlesystem.play()) : v[S].particlesystem.stop()
        } else v[S].particlesystem.stop();
    var A = pc.math.lerp(this.pingPongSpeed.x, this.pingPongSpeed.y, h) * this._pingPongDir,
        k = a.y,
        b = this.blobShadow.getLocalScale().x;
    if (this._pingPongDir < 0 ? ((k = Math.max(this.pingPong.x, k + A * t)) <= this.pingPong.x && (this._pingPongDir *= -1), b = Math.min(1.3, b - 2 * A * t)) : ((k = Math.min(this.pingPong.y, k + A * t)) >= this.pingPong.y && (this._pingPongDir *= -1), b = Math.max(.7, b - 2 * A * t)), this.blobShadow.setLocalScale(b, b, b), Helper.math.approximately(o, 0)) {
        var I = new pc.Vec3(_.x, 0, _.z).normalize().scale(d * t);
        return this.entity.setPosition(n.x + I.x, n.y, n.z + I.z), this.entity.script.skinComponent._skin.rotationRoot.setLocalRotation((new pc.Quat).slerp(this.entity.script.skinComponent._skin.rotationRoot.getLocalRotation(), i, 1)), this.entity.script.skinComponent._skin.rotationRoot.setLocalPosition(0, k, 0), e
    }
    var H = pc.math.lerp(this.steering.x, this.steering.y, h),
        R = pc.math.lerp(this.dragRadius.x, this.dragRadius.y, h),
        T = 360 * d / (2 * Math.PI * R),
        x = Math.min(Math.abs(o), H * t) * Helper.math.sign(o),
        C = (new pc.Quat).setFromAxisAngle(pc.Vec3.UP, x),
        D = (new pc.Quat).mul2(e, C),
        E = D.transformVector(pc.Vec3.BACK);
    Gizmo.line(n, n.clone().add(E.scale(2)), Gizmo.BLUE_GIZMO);
    var G = D.transformVector(o > 0 ? pc.Vec3.RIGHT : pc.Vec3.LEFT),
        N = (new pc.Quat).mul2(D.clone(), (new pc.Quat).setFromAxisAngle(pc.Vec3.UP, pc.math.lerp(0, 40, Math.min(Math.abs(p) / this.deadAngle, 1)) * Helper.math.sign(p)));
    Gizmo.line(n, n.clone().add(N.transformVector(pc.Vec3.BACK).scale(2)), Gizmo.MAGENTA_GIZMO), this.entity.script.skinComponent._skin.rotationRoot.setLocalRotation((new pc.Quat).slerp(this.entity.script.skinComponent._skin.rotationRoot.getLocalRotation(), N, .25));
    var L = n.clone().add(new pc.Vec3(G.x, 0, G.z).scale(R)),
        M = n.clone().sub(L),
        V = Math.atan2(M.z, M.x) * pc.math.RAD_TO_DEG + T * t * (o > 0 ? -1 : 1),
        O = Math.cos(V * pc.math.DEG_TO_RAD) * R,
        W = Math.sin(V * pc.math.DEG_TO_RAD) * R,
        F = new pc.Vec3(L.x + O, n.y, L.z + W);
    return Gizmo.line(L, F, Gizmo.BLUE_GIZMO), Gizmo.line(L, n, Gizmo.GREEN_GIZMO), this.entity.setPosition(L.x + O, n.y, L.z + W), this.entity.script.skinComponent._skin.rotationRoot.setLocalPosition(0, k, 0), D
}, Player.prototype.riding = function(t) {
    var e = 0,
        i = null;
    for (e = 0; e < this._inputs.length; e++)
        if (!(this._inputs[e].input.lengthSq() < .001)) {
            i = this._inputs[e].input;
            break
        }
    if (null !== i) {
        var s = (new pc.Quat).setFromAxisAngle(pc.Vec3.UP, Math.atan2(-i.x, -i.y) * pc.math.RAD_TO_DEG);
        this._angleBuffer.push(s), this._lastInputQuat = s, this._angleBuffer.length > this.inputLag ? this._lastQuat = this.lerpAngle3(t, this._lastQuat, this._angleBuffer.shift()) : this._lastQuat = this.lerpAngle3(t, this._lastQuat, this._lastInputQuat)
    } else this._angleBuffer.length > 0 ? this._lastQuat = this.lerpAngle3(t, this._lastQuat, this._angleBuffer.shift()) : this._lastQuat = this.lerpAngle3(t, this._lastQuat, this._lastInputQuat)
}, Player.prototype.destroyed = function(t) {}, Player.prototype.ftue0 = function(t) {
    this._time += t, this._time;
    var e = this.entity.script.skinComponent._skin.rotationRoot.getLocalRotation(),
        i = (new pc.Quat).setFromAxisAngle(pc.Vec3.UP, 12 * this._ftueDir),
        s = (new pc.Quat).mul2(e, i);
    this.lerpAngle3(t, e, s)
}, Player.prototype.idle = function(t) {
    var e = this.entity.script.skinComponent._skin.rotationRoot.getLocalPosition(),
        i = this.pingPongSpeed.x * this._pingPongDir * .25,
        s = this.blobShadow.getLocalScale().x,
        n = e.y;
    this._pingPongDir < 0 ? ((n = Math.max(this.pingPong.x, n + i * t)) <= this.pingPong.x && (this._pingPongDir *= -1), s = Math.min(1.3, s - 2 * i * t)) : ((n = Math.min(this.pingPong.y, n + i * t)) >= this.pingPong.y && (this._pingPongDir *= -1), s = Math.max(.7, s - 2 * i * t)), this.blobShadow.setLocalScale(s, s, s), this.entity.script.skinComponent._skin.rotationRoot.setLocalPosition(0, n, 0)
}, Player.prototype.shopIdle = function(t) {
    var e, i = this.entity.script.skinComponent._skin.rotationRoot.getLocalPosition(),
        s = -1 * Helper.math.sign(i.y),
        n = this.pingPongSpeed.x * s * .25;
    e = s < 0 ? Math.max(i.y + n * t, 0) : Math.min(i.y + n * t, 0), this.entity.script.skinComponent._skin.rotationRoot.setLocalPosition(i.x, e, i.z)
}, Player.prototype.waitingRespawn = function(t, e) {
    this._time += t, this._time >= 1 && (this._state = PlayerState.WAITING_RESPAWN2, this._time = 0)
}, Player.prototype.waitingRespawn2 = function(t) {
    this._time += t;
    var e = this._time / this.respawnCameraTween,
        i = (new pc.Vec3).lerp(this.placeOfDeath, this.respawnPoint, Helper.ease.out3(e));
    Helper.camera.directApply(pc.math.lerp(this.heightOfDeath, 8, Helper.ease.out3(e))), this.entity.setPosition(i), this._time >= this.respawnCameraTween && (this._state = PlayerState.WAITING_RESPAWN3, this._time = 0)
}, Player.prototype.waitingRespawn3 = function(t) {
    this._time += t, this.entity.script.skinComponent._shader.dissolve = Math.max(1 - this._time, 0), this.entity.script.skinComponent._shader2.dissolve = Math.max(1 - this._time, 0), this.riding(t), this.blobShadow.enabled = !0, this._time >= 1 && (Helper.camera.toNormalHeight(), this._state = PlayerState.WAITING_RESPAWN4, this._time = 0, this.entity.script.skinComponent._skin.lanceRoot.enabled = !0)
}, Player.prototype.waitingRespawn4 = function(t) {
    this._time += t, this.riding(t), this._time >= .8 && (Helper.game.respawnPlayer(), this._time = 0, this.entity.script.skinComponent._skin.turnOnTrails())
}, Player.prototype.update = function(t) {
    if (!Helper.reloading && this._initialized) {
        var e = t;
        t *= Helper.game.timeScale;
        var i = "player" === this.entity.script.actor.id;
        if (this.hyper ? (i && Inventory.ftue_hyper < 1 && (Helper.game.notificationInProgress || (Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Your speed increase in hyperspace", 2, 0, !0, !1).then((function() {
                Helper.game.showNotification2("But don't stay for long", 2, 0, !0, !0).then((function() {
                    Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
                }))
            })), Inventory.ftue_hyper = 1)), this.hyperSpaceAdditional = Math.min(this.maxHyperSpaceSpeed, this.hyperSpaceAdditional + this.hyperSpaceAcc * t), this.hyperSpaceTime += t) : (this.hyperSpaceAdditional = Math.max(0, this.hyperSpaceAdditional - this.hyperSpaceDecc * t), this.hyperSpaceTime = 0), i) {
            Helper.shaderFloor.highlightPos.x = this.entity.getPosition().x, Helper.shaderFloor.highlightPos.y = this.entity.getPosition().z;
            var s = this.hyper,
                n = this.deathVingette.element.opacity > 0;
            if (s) {
                var a = this.hyperSpaceTime / 3,
                    r = Math.abs(Math.sin(this.hyperSpaceTime * pc.math.lerp(1, 8, a)));
                this.deathVingette.element.opacity = r
            }
            if (n) {
                var o = this.deathVingette.element.opacity;
                this.deathVingette.element.opacity = Math.max(0, o - 1.5 * t)
            }
            this.respawnInvincibilityTime > 0 ? (this.respawnInvincibilityTime -= t, this.entity.script.skinComponent._shader.time += 2 * t, this.entity.script.skinComponent._shader2.time += 2 * t) : (this.respawnInvincibilityTime = 0, this.entity.script.skinComponent._shader.time = 0, this.entity.script.skinComponent._shader2.time = 0), this.entity.script.skinComponent._shader.update(), this.entity.script.skinComponent._shader2.update()
        }
        this.hyperSpaceTime > 3 && (i && Inventory.ftue_death_hyper < 3 && !Helper.game.notificationInProgress && Helper.game.lives > 1 && (Helper.game.showNotification2(Locale.get("ftue_fail_hyper"), 2, 0), Inventory.ftue_death_hyper += 1), this._startDestroySequence(), Helper.game.state !== GameState.PLAYING_FTUE || i || Helper.game.currentFtue.buggedAi(), i && Helper.camera.shake()), this[this._state](t, e)
    }
};
var Camera = pc.createScript("camera");
Camera.attributes.add("target", {
    type: "entity"
}), Camera.attributes.add("targetInMenu", {
    type: "entity"
}), Camera.attributes.add("targetInFtue", {
    type: "entity"
}), Camera.attributes.add("offset", {
    type: "vec3"
}), Camera.attributes.add("speed", {
    type: "vec2"
}), Camera.attributes.add("distance", {
    type: "vec2"
}), Camera.attributes.add("changeHeightTime", {
    type: "number"
}), Camera.attributes.add("startSequenceHeight", {
    type: "number"
}), Camera.attributes.add("startSequenceTime", {
    type: "number"
}), Camera.attributes.add("shopSequenceHeight", {
    type: "number"
}), Camera.attributes.add("regularHeight", {
    type: "number"
}), Camera.attributes.add("speedUpHeight", {
    type: "number"
}), Camera.attributes.add("pickupBounceTime", {
    type: "number"
}), Camera.attributes.add("pickupElasticArgs", {
    type: "vec2"
}), Camera.attributes.add("shakeStrength", {
    type: "vec2"
}), Camera.prototype.postInitialize = function() {
    this._cahcedPos = new pc.Vec3, this._tween = null, this._height = {
        value: this.startSequenceHeight
    }, this._wiggle = {
        x: 0,
        z: 0
    }
}, Camera.prototype.lookClose = function() {
    this.entity.camera.orthoHeight = this.startSequenceHeight
}, Camera.prototype.launchStartSequence = function() {
    this.entity.camera.orthoHeight = this.startSequenceHeight, this._height.value = this.startSequenceHeight, this._startSequence = !0, this._startSequenceTime = 0;
    const e = this;
    return new Promise((t => {
        e._tween && (e._tween.kill(), e._tween = null), e._tween = gsap.fromTo(e._height, {
            value: e.startSequenceHeight
        }, {
            value: e.regularHeight,
            duration: e.startSequenceTime,
            ease: "power2.in",
            onComplete: () => {
                e._startSequence = !1, t()
            }
        })
    }))
}, Camera.prototype.shake = function() {
    Math.random(), Math.random()
}, Camera.prototype.toSpeedUpHeight = function() {
    Helper.game.sessionTimer <= 3 || 0 === Helper.game.lives || this.applyLevel(this.speedUpHeight)
}, Camera.prototype.toNormalHeight = function() {
    Helper.game.sessionTimer <= 3 || 0 === Helper.game.lives || this.applyLevel(this.regularHeight)
}, Camera.prototype.directApply = function(e) {
    this._height.value = e
}, Camera.prototype.applyLevel = function(e) {
    if (this._startSequence) throw "Cannot tween camera during start sequence";
    this._tween && (this._tween.kill(), this._tween = null), this._tween = gsap.fromTo(this._height, {
        value: this._height.value
    }, {
        value: e,
        duration: this.changeHeightTime,
        ease: "power3.inOut"
    })
}, Camera.prototype.pickupBounce = function() {
    if (this._startSequence) throw "Cannot tween camera during start sequence";
    this._tween && (this._tween.kill(), this._tween = null), this._tween = gsap.fromTo(this._height, {
        value: this._height.value - .3
    }, {
        value: this._height.value,
        duration: this.pickupBounceTime,
        ease: "elastic.out(" + this.pickupElasticArgs.x + ", " + this.pickupElasticArgs.y + ")"
    })
}, Camera.prototype.postUpdate = function(e) {
    var t;
    if (Helper.game.state === GameState.FTUE0 || Helper.game.state === GameState.FTUE1) t = this.targetInFtue.getPosition(), this._cahcedPos.set(t.x, t.y, t.z);
    else if (Helper.game.state === GameState.MAIN_MENU) t = this.targetInMenu.getPosition(), this._cahcedPos.set(t.x, t.y, t.z);
    else if (this._startSequence) {
        this._startSequenceTime += e;
        var a = this._startSequenceTime / this.startSequenceTime,
            i = this.targetInMenu.getPosition(),
            s = this.target.getPosition();
        this._cahcedPos.lerp(i, s, a)
    } else t = this.target.getPosition(), this._cahcedPos.set(t.x, t.y, t.z);
    var r = this._cahcedPos.add(this.offset);
    r.x += this._wiggle.x, r.z += this._wiggle.z, this.entity.setPosition(r), Helper.math.approximately(this._wiggle.x, 0) && Helper.math.approximately(this._wiggle.z, 0) && this.entity.lookAt(t), Helper.game.birdsView ? this.entity.camera.orthoHeight = 40 : this.entity.camera.orthoHeight = this._height.value
}; // dat.gui.min.js
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.dat = {})
}(this, function(e) {
    "use strict";

    function t(e, t) {
        var n = e.__state.conversionName.toString(),
            o = Math.round(e.r),
            i = Math.round(e.g),
            r = Math.round(e.b),
            s = e.a,
            a = Math.round(e.h),
            l = e.s.toFixed(1),
            d = e.v.toFixed(1);
        if (t || "THREE_CHAR_HEX" === n || "SIX_CHAR_HEX" === n) {
            for (var c = e.hex.toString(16); c.length < 6;) c = "0" + c;
            return "#" + c
        }
        return "CSS_RGB" === n ? "rgb(" + o + "," + i + "," + r + ")" : "CSS_RGBA" === n ? "rgba(" + o + "," + i + "," + r + "," + s + ")" : "HEX" === n ? "0x" + e.hex.toString(16) : "RGB_ARRAY" === n ? "[" + o + "," + i + "," + r + "]" : "RGBA_ARRAY" === n ? "[" + o + "," + i + "," + r + "," + s + "]" : "RGB_OBJ" === n ? "{r:" + o + ",g:" + i + ",b:" + r + "}" : "RGBA_OBJ" === n ? "{r:" + o + ",g:" + i + ",b:" + r + ",a:" + s + "}" : "HSV_OBJ" === n ? "{h:" + a + ",s:" + l + ",v:" + d + "}" : "HSVA_OBJ" === n ? "{h:" + a + ",s:" + l + ",v:" + d + ",a:" + s + "}" : "unknown format"
    }

    function n(e, t, n) {
        Object.defineProperty(e, t, {
            get: function() {
                return "RGB" === this.__state.space ? this.__state[t] : (I.recalculateRGB(this, t, n), this.__state[t])
            },
            set: function(e) {
                "RGB" !== this.__state.space && (I.recalculateRGB(this, t, n), this.__state.space = "RGB"), this.__state[t] = e
            }
        })
    }

    function o(e, t) {
        Object.defineProperty(e, t, {
            get: function() {
                return "HSV" === this.__state.space ? this.__state[t] : (I.recalculateHSV(this), this.__state[t])
            },
            set: function(e) {
                "HSV" !== this.__state.space && (I.recalculateHSV(this), this.__state.space = "HSV"), this.__state[t] = e
            }
        })
    }

    function i(e) {
        if ("0" === e || S.isUndefined(e)) return 0;
        var t = e.match(U);
        return S.isNull(t) ? 0 : parseFloat(t[1])
    }

    function r(e) {
        var t = e.toString();
        return t.indexOf(".") > -1 ? t.length - t.indexOf(".") - 1 : 0
    }

    function s(e, t) {
        var n = Math.pow(10, t);
        return Math.round(e * n) / n
    }

    function a(e, t, n, o, i) {
        return o + (e - t) / (n - t) * (i - o)
    }

    function l(e, t, n, o) {
        e.style.background = "", S.each(ee, function(i) {
            e.style.cssText += "background: " + i + "linear-gradient(" + t + ", " + n + " 0%, " + o + " 100%); "
        })
    }

    function d(e) {
        e.style.background = "", e.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", e.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", e.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", e.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", e.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
    }

    function c(e, t, n) {
        var o = document.createElement("li");
        return t && o.appendChild(t), n ? e.__ul.insertBefore(o, n) : e.__ul.appendChild(o), e.onResize(), o
    }

    function u(e) {
        X.unbind(window, "resize", e.__resizeHandler), e.saveToLocalStorageIfPossible && X.unbind(window, "unload", e.saveToLocalStorageIfPossible)
    }

    function _(e, t) {
        var n = e.__preset_select[e.__preset_select.selectedIndex];
        n.innerHTML = t ? n.value + "*" : n.value
    }

    function h(e, t, n) {
        if (n.__li = t, n.__gui = e, S.extend(n, {
                options: function(t) {
                    if (arguments.length > 1) {
                        var o = n.__li.nextElementSibling;
                        return n.remove(), f(e, n.object, n.property, {
                            before: o,
                            factoryArgs: [S.toArray(arguments)]
                        })
                    }
                    if (S.isArray(t) || S.isObject(t)) {
                        var i = n.__li.nextElementSibling;
                        return n.remove(), f(e, n.object, n.property, {
                            before: i,
                            factoryArgs: [t]
                        })
                    }
                },
                name: function(e) {
                    return n.__li.firstElementChild.firstElementChild.innerHTML = e, n
                },
                listen: function() {
                    return n.__gui.listen(n), n
                },
                remove: function() {
                    return n.__gui.remove(n), n
                }
            }), n instanceof q) {
            var o = new Q(n.object, n.property, {
                min: n.__min,
                max: n.__max,
                step: n.__step
            });
            S.each(["updateDisplay", "onChange", "onFinishChange", "step", "min", "max"], function(e) {
                var t = n[e],
                    i = o[e];
                n[e] = o[e] = function() {
                    var e = Array.prototype.slice.call(arguments);
                    return i.apply(o, e), t.apply(n, e)
                }
            }), X.addClass(t, "has-slider"), n.domElement.insertBefore(o.domElement, n.domElement.firstElementChild)
        } else if (n instanceof Q) {
            var i = function(t) {
                if (S.isNumber(n.__min) && S.isNumber(n.__max)) {
                    var o = n.__li.firstElementChild.firstElementChild.innerHTML,
                        i = n.__gui.__listening.indexOf(n) > -1;
                    n.remove();
                    var r = f(e, n.object, n.property, {
                        before: n.__li.nextElementSibling,
                        factoryArgs: [n.__min, n.__max, n.__step]
                    });
                    return r.name(o), i && r.listen(), r
                }
                return t
            };
            n.min = S.compose(i, n.min), n.max = S.compose(i, n.max)
        } else n instanceof K ? (X.bind(t, "click", function() {
            X.fakeEvent(n.__checkbox, "click")
        }), X.bind(n.__checkbox, "click", function(e) {
            e.stopPropagation()
        })) : n instanceof Z ? (X.bind(t, "click", function() {
            X.fakeEvent(n.__button, "click")
        }), X.bind(t, "mouseover", function() {
            X.addClass(n.__button, "hover")
        }), X.bind(t, "mouseout", function() {
            X.removeClass(n.__button, "hover")
        })) : n instanceof $ && (X.addClass(t, "color"), n.updateDisplay = S.compose(function(e) {
            return t.style.borderLeftColor = n.__color.toString(), e
        }, n.updateDisplay), n.updateDisplay());
        n.setValue = S.compose(function(t) {
            return e.getRoot().__preset_select && n.isModified() && _(e.getRoot(), !0), t
        }, n.setValue)
    }

    function p(e, t) {
        var n = e.getRoot(),
            o = n.__rememberedObjects.indexOf(t.object);
        if (-1 !== o) {
            var i = n.__rememberedObjectIndecesToControllers[o];
            if (void 0 === i && (i = {}, n.__rememberedObjectIndecesToControllers[o] = i), i[t.property] = t, n.load && n.load.remembered) {
                var r = n.load.remembered,
                    s = void 0;
                if (r[e.preset]) s = r[e.preset];
                else {
                    if (!r[se]) return;
                    s = r[se]
                }
                if (s[o] && void 0 !== s[o][t.property]) {
                    var a = s[o][t.property];
                    t.initialValue = a, t.setValue(a)
                }
            }
        }
    }

    function f(e, t, n, o) {
        if (void 0 === t[n]) throw new Error('Object "' + t + '" has no property "' + n + '"');
        var i = void 0;
        if (o.color) i = new $(t, n);
        else {
            var r = [t, n].concat(o.factoryArgs);
            i = ne.apply(e, r)
        }
        o.before instanceof z && (o.before = o.before.__li), p(e, i), X.addClass(i.domElement, "c");
        var s = document.createElement("span");
        X.addClass(s, "property-name"), s.innerHTML = i.property;
        var a = document.createElement("div");
        a.appendChild(s), a.appendChild(i.domElement);
        var l = c(e, a, o.before);
        return X.addClass(l, he.CLASS_CONTROLLER_ROW), i instanceof $ ? X.addClass(l, "color") : X.addClass(l, H(i.getValue())), h(e, l, i), e.__controllers.push(i), i
    }

    function m(e, t) {
        return document.location.href + "." + t
    }

    function g(e, t, n) {
        var o = document.createElement("option");
        o.innerHTML = t, o.value = t, e.__preset_select.appendChild(o), n && (e.__preset_select.selectedIndex = e.__preset_select.length - 1)
    }

    function b(e, t) {
        t.style.display = e.useLocalStorage ? "block" : "none"
    }

    function v(e) {
        var t = e.__save_row = document.createElement("li");
        X.addClass(e.domElement, "has-save"), e.__ul.insertBefore(t, e.__ul.firstChild), X.addClass(t, "save-row");
        var n = document.createElement("span");
        n.innerHTML = "&nbsp;", X.addClass(n, "button gears");
        var o = document.createElement("span");
        o.innerHTML = "Save", X.addClass(o, "button"), X.addClass(o, "save");
        var i = document.createElement("span");
        i.innerHTML = "New", X.addClass(i, "button"), X.addClass(i, "save-as");
        var r = document.createElement("span");
        r.innerHTML = "Revert", X.addClass(r, "button"), X.addClass(r, "revert");
        var s = e.__preset_select = document.createElement("select");
        if (e.load && e.load.remembered ? S.each(e.load.remembered, function(t, n) {
                g(e, n, n === e.preset)
            }) : g(e, se, !1), X.bind(s, "change", function() {
                for (var t = 0; t < e.__preset_select.length; t++) e.__preset_select[t].innerHTML = e.__preset_select[t].value;
                e.preset = this.value
            }), t.appendChild(s), t.appendChild(n), t.appendChild(o), t.appendChild(i), t.appendChild(r), ae) {
            var a = document.getElementById("dg-local-explain"),
                l = document.getElementById("dg-local-storage");
            document.getElementById("dg-save-locally").style.display = "block", "true" === localStorage.getItem(m(e, "isLocal")) && l.setAttribute("checked", "checked"), b(e, a), X.bind(l, "change", function() {
                e.useLocalStorage = !e.useLocalStorage, b(e, a)
            })
        }
        var d = document.getElementById("dg-new-constructor");
        X.bind(d, "keydown", function(e) {
            !e.metaKey || 67 !== e.which && 67 !== e.keyCode || le.hide()
        }), X.bind(n, "click", function() {
            d.innerHTML = JSON.stringify(e.getSaveObject(), void 0, 2), le.show(), d.focus(), d.select()
        }), X.bind(o, "click", function() {
            e.save()
        }), X.bind(i, "click", function() {
            var t = prompt("Enter a new preset name.");
            t && e.saveAs(t)
        }), X.bind(r, "click", function() {
            e.revert()
        })
    }

    function y(e) {
        function t(t) {
            return t.preventDefault(), e.width += i - t.clientX, e.onResize(), i = t.clientX, !1
        }

        function n() {
            X.removeClass(e.__closeButton, he.CLASS_DRAG), X.unbind(window, "mousemove", t), X.unbind(window, "mouseup", n)
        }

        function o(o) {
            return o.preventDefault(), i = o.clientX, X.addClass(e.__closeButton, he.CLASS_DRAG), X.bind(window, "mousemove", t), X.bind(window, "mouseup", n), !1
        }
        var i = void 0;
        e.__resize_handle = document.createElement("div"), S.extend(e.__resize_handle.style, {
            width: "6px",
            marginLeft: "-3px",
            height: "200px",
            cursor: "ew-resize",
            position: "absolute"
        }), X.bind(e.__resize_handle, "mousedown", o), X.bind(e.__closeButton, "mousedown", o), e.domElement.insertBefore(e.__resize_handle, e.domElement.firstElementChild)
    }

    function w(e, t) {
        e.domElement.style.width = t + "px", e.__save_row && e.autoPlace && (e.__save_row.style.width = t + "px"), e.__closeButton && (e.__closeButton.style.width = t + "px")
    }

    function x(e, t) {
        var n = {};
        return S.each(e.__rememberedObjects, function(o, i) {
            var r = {},
                s = e.__rememberedObjectIndecesToControllers[i];
            S.each(s, function(e, n) {
                r[n] = t ? e.initialValue : e.getValue()
            }), n[i] = r
        }), n
    }

    function E(e) {
        for (var t = 0; t < e.__preset_select.length; t++) e.__preset_select[t].value === e.preset && (e.__preset_select.selectedIndex = t)
    }

    function C(e) {
        0 !== e.length && oe.call(window, function() {
            C(e)
        }), S.each(e, function(e) {
            e.updateDisplay()
        })
    }
    var A = Array.prototype.forEach,
        k = Array.prototype.slice,
        S = {
            BREAK: {},
            extend: function(e) {
                return this.each(k.call(arguments, 1), function(t) {
                    (this.isObject(t) ? Object.keys(t) : []).forEach(function(n) {
                        this.isUndefined(t[n]) || (e[n] = t[n])
                    }.bind(this))
                }, this), e
            },
            defaults: function(e) {
                return this.each(k.call(arguments, 1), function(t) {
                    (this.isObject(t) ? Object.keys(t) : []).forEach(function(n) {
                        this.isUndefined(e[n]) && (e[n] = t[n])
                    }.bind(this))
                }, this), e
            },
            compose: function() {
                var e = k.call(arguments);
                return function() {
                    for (var t = k.call(arguments), n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)];
                    return t[0]
                }
            },
            each: function(e, t, n) {
                if (e)
                    if (A && e.forEach && e.forEach === A) e.forEach(t, n);
                    else if (e.length === e.length + 0) {
                    var o = void 0,
                        i = void 0;
                    for (o = 0, i = e.length; o < i; o++)
                        if (o in e && t.call(n, e[o], o) === this.BREAK) return
                } else
                    for (var r in e)
                        if (t.call(n, e[r], r) === this.BREAK) return
            },
            defer: function(e) {
                setTimeout(e, 0)
            },
            debounce: function(e, t, n) {
                var o = void 0;
                return function() {
                    var i = this,
                        r = arguments,
                        s = n || !o;
                    clearTimeout(o), o = setTimeout(function() {
                        o = null, n || e.apply(i, r)
                    }, t), s && e.apply(i, r)
                }
            },
            toArray: function(e) {
                return e.toArray ? e.toArray() : k.call(e)
            },
            isUndefined: function(e) {
                return void 0 === e
            },
            isNull: function(e) {
                return null === e
            },
            isNaN: function(e) {
                function t(t) {
                    return e.apply(this, arguments)
                }
                return t.toString = function() {
                    return e.toString()
                }, t
            }(function(e) {
                return isNaN(e)
            }),
            isArray: Array.isArray || function(e) {
                return e.constructor === Array
            },
            isObject: function(e) {
                return e === Object(e)
            },
            isNumber: function(e) {
                return e === e + 0
            },
            isString: function(e) {
                return e === e + ""
            },
            isBoolean: function(e) {
                return !1 === e || !0 === e
            },
            isFunction: function(e) {
                return e instanceof Function
            }
        },
        O = [{
            litmus: S.isString,
            conversions: {
                THREE_CHAR_HEX: {
                    read: function(e) {
                        var t = e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                        return null !== t && {
                            space: "HEX",
                            hex: parseInt("0x" + t[1].toString() + t[1].toString() + t[2].toString() + t[2].toString() + t[3].toString() + t[3].toString(), 0)
                        }
                    },
                    write: t
                },
                SIX_CHAR_HEX: {
                    read: function(e) {
                        var t = e.match(/^#([A-F0-9]{6})$/i);
                        return null !== t && {
                            space: "HEX",
                            hex: parseInt("0x" + t[1].toString(), 0)
                        }
                    },
                    write: t
                },
                CSS_RGB: {
                    read: function(e) {
                        var t = e.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                        return null !== t && {
                            space: "RGB",
                            r: parseFloat(t[1]),
                            g: parseFloat(t[2]),
                            b: parseFloat(t[3])
                        }
                    },
                    write: t
                },
                CSS_RGBA: {
                    read: function(e) {
                        var t = e.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                        return null !== t && {
                            space: "RGB",
                            r: parseFloat(t[1]),
                            g: parseFloat(t[2]),
                            b: parseFloat(t[3]),
                            a: parseFloat(t[4])
                        }
                    },
                    write: t
                }
            }
        }, {
            litmus: S.isNumber,
            conversions: {
                HEX: {
                    read: function(e) {
                        return {
                            space: "HEX",
                            hex: e,
                            conversionName: "HEX"
                        }
                    },
                    write: function(e) {
                        return e.hex
                    }
                }
            }
        }, {
            litmus: S.isArray,
            conversions: {
                RGB_ARRAY: {
                    read: function(e) {
                        return 3 === e.length && {
                            space: "RGB",
                            r: e[0],
                            g: e[1],
                            b: e[2]
                        }
                    },
                    write: function(e) {
                        return [e.r, e.g, e.b]
                    }
                },
                RGBA_ARRAY: {
                    read: function(e) {
                        return 4 === e.length && {
                            space: "RGB",
                            r: e[0],
                            g: e[1],
                            b: e[2],
                            a: e[3]
                        }
                    },
                    write: function(e) {
                        return [e.r, e.g, e.b, e.a]
                    }
                }
            }
        }, {
            litmus: S.isObject,
            conversions: {
                RGBA_OBJ: {
                    read: function(e) {
                        return !!(S.isNumber(e.r) && S.isNumber(e.g) && S.isNumber(e.b) && S.isNumber(e.a)) && {
                            space: "RGB",
                            r: e.r,
                            g: e.g,
                            b: e.b,
                            a: e.a
                        }
                    },
                    write: function(e) {
                        return {
                            r: e.r,
                            g: e.g,
                            b: e.b,
                            a: e.a
                        }
                    }
                },
                RGB_OBJ: {
                    read: function(e) {
                        return !!(S.isNumber(e.r) && S.isNumber(e.g) && S.isNumber(e.b)) && {
                            space: "RGB",
                            r: e.r,
                            g: e.g,
                            b: e.b
                        }
                    },
                    write: function(e) {
                        return {
                            r: e.r,
                            g: e.g,
                            b: e.b
                        }
                    }
                },
                HSVA_OBJ: {
                    read: function(e) {
                        return !!(S.isNumber(e.h) && S.isNumber(e.s) && S.isNumber(e.v) && S.isNumber(e.a)) && {
                            space: "HSV",
                            h: e.h,
                            s: e.s,
                            v: e.v,
                            a: e.a
                        }
                    },
                    write: function(e) {
                        return {
                            h: e.h,
                            s: e.s,
                            v: e.v,
                            a: e.a
                        }
                    }
                },
                HSV_OBJ: {
                    read: function(e) {
                        return !!(S.isNumber(e.h) && S.isNumber(e.s) && S.isNumber(e.v)) && {
                            space: "HSV",
                            h: e.h,
                            s: e.s,
                            v: e.v
                        }
                    },
                    write: function(e) {
                        return {
                            h: e.h,
                            s: e.s,
                            v: e.v
                        }
                    }
                }
            }
        }],
        T = void 0,
        L = void 0,
        R = function() {
            L = !1;
            var e = arguments.length > 1 ? S.toArray(arguments) : arguments[0];
            return S.each(O, function(t) {
                if (t.litmus(e)) return S.each(t.conversions, function(t, n) {
                    if (T = t.read(e), !1 === L && !1 !== T) return L = T, T.conversionName = n, T.conversion = t, S.BREAK
                }), S.BREAK
            }), L
        },
        B = void 0,
        N = {
            hsv_to_rgb: function(e, t, n) {
                var o = Math.floor(e / 60) % 6,
                    i = e / 60 - Math.floor(e / 60),
                    r = n * (1 - t),
                    s = n * (1 - i * t),
                    a = n * (1 - (1 - i) * t),
                    l = [
                        [n, a, r],
                        [s, n, r],
                        [r, n, a],
                        [r, s, n],
                        [a, r, n],
                        [n, r, s]
                    ][o];
                return {
                    r: 255 * l[0],
                    g: 255 * l[1],
                    b: 255 * l[2]
                }
            },
            rgb_to_hsv: function(e, t, n) {
                var o = Math.min(e, t, n),
                    i = Math.max(e, t, n),
                    r = i - o,
                    s = void 0,
                    a = void 0;
                return 0 === i ? {
                    h: NaN,
                    s: 0,
                    v: 0
                } : (a = r / i, s = e === i ? (t - n) / r : t === i ? 2 + (n - e) / r : 4 + (e - t) / r, (s /= 6) < 0 && (s += 1), {
                    h: 360 * s,
                    s: a,
                    v: i / 255
                })
            },
            rgb_to_hex: function(e, t, n) {
                var o = this.hex_with_component(0, 2, e);
                return o = this.hex_with_component(o, 1, t), o = this.hex_with_component(o, 0, n)
            },
            component_from_hex: function(e, t) {
                return e >> 8 * t & 255
            },
            hex_with_component: function(e, t, n) {
                return n << (B = 8 * t) | e & ~(255 << B)
            }
        },
        H = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        F = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        P = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }
            return function(t, n, o) {
                return n && e(t.prototype, n), o && e(t, o), t
            }
        }(),
        D = function e(t, n, o) {
            null === t && (t = Function.prototype);
            var i = Object.getOwnPropertyDescriptor(t, n);
            if (void 0 === i) {
                var r = Object.getPrototypeOf(t);
                return null === r ? void 0 : e(r, n, o)
            }
            if ("value" in i) return i.value;
            var s = i.get;
            if (void 0 !== s) return s.call(o)
        },
        j = function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        },
        V = function(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        },
        I = function() {
            function e() {
                if (F(this, e), this.__state = R.apply(this, arguments), !1 === this.__state) throw new Error("Failed to interpret color arguments");
                this.__state.a = this.__state.a || 1
            }
            return P(e, [{
                key: "toString",
                value: function() {
                    return t(this)
                }
            }, {
                key: "toHexString",
                value: function() {
                    return t(this, !0)
                }
            }, {
                key: "toOriginal",
                value: function() {
                    return this.__state.conversion.write(this)
                }
            }]), e
        }();
    I.recalculateRGB = function(e, t, n) {
        if ("HEX" === e.__state.space) e.__state[t] = N.component_from_hex(e.__state.hex, n);
        else {
            if ("HSV" !== e.__state.space) throw new Error("Corrupted color state");
            S.extend(e.__state, N.hsv_to_rgb(e.__state.h, e.__state.s, e.__state.v))
        }
    }, I.recalculateHSV = function(e) {
        var t = N.rgb_to_hsv(e.r, e.g, e.b);
        S.extend(e.__state, {
            s: t.s,
            v: t.v
        }), S.isNaN(t.h) ? S.isUndefined(e.__state.h) && (e.__state.h = 0) : e.__state.h = t.h
    }, I.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], n(I.prototype, "r", 2), n(I.prototype, "g", 1), n(I.prototype, "b", 0), o(I.prototype, "h"), o(I.prototype, "s"), o(I.prototype, "v"), Object.defineProperty(I.prototype, "a", {
        get: function() {
            return this.__state.a
        },
        set: function(e) {
            this.__state.a = e
        }
    }), Object.defineProperty(I.prototype, "hex", {
        get: function() {
            return "HEX" !== this.__state.space && (this.__state.hex = N.rgb_to_hex(this.r, this.g, this.b), this.__state.space = "HEX"), this.__state.hex
        },
        set: function(e) {
            this.__state.space = "HEX", this.__state.hex = e
        }
    });
    var z = function() {
            function e(t, n) {
                F(this, e), this.initialValue = t[n], this.domElement = document.createElement("div"), this.object = t, this.property = n, this.__onChange = void 0, this.__onFinishChange = void 0
            }
            return P(e, [{
                key: "onChange",
                value: function(e) {
                    return this.__onChange = e, this
                }
            }, {
                key: "onFinishChange",
                value: function(e) {
                    return this.__onFinishChange = e, this
                }
            }, {
                key: "setValue",
                value: function(e) {
                    return this.object[this.property] = e, this.__onChange && this.__onChange.call(this, e), this.updateDisplay(), this
                }
            }, {
                key: "getValue",
                value: function() {
                    return this.object[this.property]
                }
            }, {
                key: "updateDisplay",
                value: function() {
                    return this
                }
            }, {
                key: "isModified",
                value: function() {
                    return this.initialValue !== this.getValue()
                }
            }]), e
        }(),
        M = {
            HTMLEvents: ["change"],
            MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
            KeyboardEvents: ["keydown"]
        },
        G = {};
    S.each(M, function(e, t) {
        S.each(e, function(e) {
            G[e] = t
        })
    });
    var U = /(\d+(\.\d+)?)px/,
        X = {
            makeSelectable: function(e, t) {
                void 0 !== e && void 0 !== e.style && (e.onselectstart = t ? function() {
                    return !1
                } : function() {}, e.style.MozUserSelect = t ? "auto" : "none", e.style.KhtmlUserSelect = t ? "auto" : "none", e.unselectable = t ? "on" : "off")
            },
            makeFullscreen: function(e, t, n) {
                var o = n,
                    i = t;
                S.isUndefined(i) && (i = !0), S.isUndefined(o) && (o = !0), e.style.position = "absolute", i && (e.style.left = 0, e.style.right = 0), o && (e.style.top = 0, e.style.bottom = 0)
            },
            fakeEvent: function(e, t, n, o) {
                var i = n || {},
                    r = G[t];
                if (!r) throw new Error("Event type " + t + " not supported.");
                var s = document.createEvent(r);
                switch (r) {
                    case "MouseEvents":
                        var a = i.x || i.clientX || 0,
                            l = i.y || i.clientY || 0;
                        s.initMouseEvent(t, i.bubbles || !1, i.cancelable || !0, window, i.clickCount || 1, 0, 0, a, l, !1, !1, !1, !1, 0, null);
                        break;
                    case "KeyboardEvents":
                        var d = s.initKeyboardEvent || s.initKeyEvent;
                        S.defaults(i, {
                            cancelable: !0,
                            ctrlKey: !1,
                            altKey: !1,
                            shiftKey: !1,
                            metaKey: !1,
                            keyCode: void 0,
                            charCode: void 0
                        }), d(t, i.bubbles || !1, i.cancelable, window, i.ctrlKey, i.altKey, i.shiftKey, i.metaKey, i.keyCode, i.charCode);
                        break;
                    default:
                        s.initEvent(t, i.bubbles || !1, i.cancelable || !0)
                }
                S.defaults(s, o), e.dispatchEvent(s)
            },
            bind: function(e, t, n, o) {
                var i = o || !1;
                return e.addEventListener ? e.addEventListener(t, n, i) : e.attachEvent && e.attachEvent("on" + t, n), X
            },
            unbind: function(e, t, n, o) {
                var i = o || !1;
                return e.removeEventListener ? e.removeEventListener(t, n, i) : e.detachEvent && e.detachEvent("on" + t, n), X
            },
            addClass: function(e, t) {
                if (void 0 === e.className) e.className = t;
                else if (e.className !== t) {
                    var n = e.className.split(/ +/); - 1 === n.indexOf(t) && (n.push(t), e.className = n.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                }
                return X
            },
            removeClass: function(e, t) {
                if (t)
                    if (e.className === t) e.removeAttribute("class");
                    else {
                        var n = e.className.split(/ +/),
                            o = n.indexOf(t); - 1 !== o && (n.splice(o, 1), e.className = n.join(" "))
                    }
                else e.className = void 0;
                return X
            },
            hasClass: function(e, t) {
                return new RegExp("(?:^|\\s+)" + t + "(?:\\s+|$)").test(e.className) || !1
            },
            getWidth: function(e) {
                var t = getComputedStyle(e);
                return i(t["border-left-width"]) + i(t["border-right-width"]) + i(t["padding-left"]) + i(t["padding-right"]) + i(t.width)
            },
            getHeight: function(e) {
                var t = getComputedStyle(e);
                return i(t["border-top-width"]) + i(t["border-bottom-width"]) + i(t["padding-top"]) + i(t["padding-bottom"]) + i(t.height)
            },
            getOffset: function(e) {
                var t = e,
                    n = {
                        left: 0,
                        top: 0
                    };
                if (t.offsetParent)
                    do {
                        n.left += t.offsetLeft, n.top += t.offsetTop, t = t.offsetParent
                    } while (t);
                return n
            },
            isActive: function(e) {
                return e === document.activeElement && (e.type || e.href)
            }
        },
        K = function(e) {
            function t(e, n) {
                F(this, t);
                var o = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                    i = o;
                return o.__prev = o.getValue(), o.__checkbox = document.createElement("input"), o.__checkbox.setAttribute("type", "checkbox"), X.bind(o.__checkbox, "change", function() {
                    i.setValue(!i.__prev)
                }, !1), o.domElement.appendChild(o.__checkbox), o.updateDisplay(), o
            }
            return j(t, z), P(t, [{
                key: "setValue",
                value: function(e) {
                    var n = D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setValue", this).call(this, e);
                    return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), n
                }
            }, {
                key: "updateDisplay",
                value: function() {
                    return !0 === this.getValue() ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0, this.__prev = !0) : (this.__checkbox.checked = !1, this.__prev = !1), D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
                }
            }]), t
        }(),
        Y = function(e) {
            function t(e, n, o) {
                F(this, t);
                var i = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                    r = o,
                    s = i;
                if (i.__select = document.createElement("select"), S.isArray(r)) {
                    var a = {};
                    S.each(r, function(e) {
                        a[e] = e
                    }), r = a
                }
                return S.each(r, function(e, t) {
                    var n = document.createElement("option");
                    n.innerHTML = t, n.setAttribute("value", e), s.__select.appendChild(n)
                }), i.updateDisplay(), X.bind(i.__select, "change", function() {
                    var e = this.options[this.selectedIndex].value;
                    s.setValue(e)
                }), i.domElement.appendChild(i.__select), i
            }
            return j(t, z), P(t, [{
                key: "setValue",
                value: function(e) {
                    var n = D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setValue", this).call(this, e);
                    return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), n
                }
            }, {
                key: "updateDisplay",
                value: function() {
                    return X.isActive(this.__select) ? this : (this.__select.value = this.getValue(), D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this))
                }
            }]), t
        }(),
        J = function(e) {
            function t(e, n) {
                function o() {
                    r.setValue(r.__input.value)
                }
                F(this, t);
                var i = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                    r = i;
                return i.__input = document.createElement("input"), i.__input.setAttribute("type", "text"), X.bind(i.__input, "keyup", o), X.bind(i.__input, "change", o), X.bind(i.__input, "blur", function() {
                    r.__onFinishChange && r.__onFinishChange.call(r, r.getValue())
                }), X.bind(i.__input, "keydown", function(e) {
                    13 === e.keyCode && this.blur()
                }), i.updateDisplay(), i.domElement.appendChild(i.__input), i
            }
            return j(t, z), P(t, [{
                key: "updateDisplay",
                value: function() {
                    return X.isActive(this.__input) || (this.__input.value = this.getValue()), D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
                }
            }]), t
        }(),
        W = function(e) {
            function t(e, n, o) {
                F(this, t);
                var i = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                    s = o || {};
                return i.__min = s.min, i.__max = s.max, i.__step = s.step, S.isUndefined(i.__step) ? 0 === i.initialValue ? i.__impliedStep = 1 : i.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(i.initialValue)) / Math.LN10)) / 10 : i.__impliedStep = i.__step, i.__precision = r(i.__impliedStep), i
            }
            return j(t, z), P(t, [{
                key: "setValue",
                value: function(e) {
                    var n = e;
                    return void 0 !== this.__min && n < this.__min ? n = this.__min : void 0 !== this.__max && n > this.__max && (n = this.__max), void 0 !== this.__step && n % this.__step != 0 && (n = Math.round(n / this.__step) * this.__step), D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setValue", this).call(this, n)
                }
            }, {
                key: "min",
                value: function(e) {
                    return this.__min = e, this
                }
            }, {
                key: "max",
                value: function(e) {
                    return this.__max = e, this
                }
            }, {
                key: "step",
                value: function(e) {
                    return this.__step = e, this.__impliedStep = e, this.__precision = r(e), this
                }
            }]), t
        }(),
        Q = function(e) {
            function t(e, n, o) {
                function i() {
                    l.__onFinishChange && l.__onFinishChange.call(l, l.getValue())
                }

                function r(e) {
                    var t = d - e.clientY;
                    l.setValue(l.getValue() + t * l.__impliedStep), d = e.clientY
                }

                function s() {
                    X.unbind(window, "mousemove", r), X.unbind(window, "mouseup", s), i()
                }
                F(this, t);
                var a = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o));
                a.__truncationSuspended = !1;
                var l = a,
                    d = void 0;
                return a.__input = document.createElement("input"), a.__input.setAttribute("type", "text"), X.bind(a.__input, "change", function() {
                    var e = parseFloat(l.__input.value);
                    S.isNaN(e) || l.setValue(e)
                }), X.bind(a.__input, "blur", function() {
                    i()
                }), X.bind(a.__input, "mousedown", function(e) {
                    X.bind(window, "mousemove", r), X.bind(window, "mouseup", s), d = e.clientY
                }), X.bind(a.__input, "keydown", function(e) {
                    13 === e.keyCode && (l.__truncationSuspended = !0, this.blur(), l.__truncationSuspended = !1, i())
                }), a.updateDisplay(), a.domElement.appendChild(a.__input), a
            }
            return j(t, W), P(t, [{
                key: "updateDisplay",
                value: function() {
                    return this.__input.value = this.__truncationSuspended ? this.getValue() : s(this.getValue(), this.__precision), D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
                }
            }]), t
        }(),
        q = function(e) {
            function t(e, n, o, i, r) {
                function s(e) {
                    e.preventDefault();
                    var t = _.__background.getBoundingClientRect();
                    return _.setValue(a(e.clientX, t.left, t.right, _.__min, _.__max)), !1
                }

                function l() {
                    X.unbind(window, "mousemove", s), X.unbind(window, "mouseup", l), _.__onFinishChange && _.__onFinishChange.call(_, _.getValue())
                }

                function d(e) {
                    var t = e.touches[0].clientX,
                        n = _.__background.getBoundingClientRect();
                    _.setValue(a(t, n.left, n.right, _.__min, _.__max))
                }

                function c() {
                    X.unbind(window, "touchmove", d), X.unbind(window, "touchend", c), _.__onFinishChange && _.__onFinishChange.call(_, _.getValue())
                }
                F(this, t);
                var u = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, {
                        min: o,
                        max: i,
                        step: r
                    })),
                    _ = u;
                return u.__background = document.createElement("div"), u.__foreground = document.createElement("div"), X.bind(u.__background, "mousedown", function(e) {
                    document.activeElement.blur(), X.bind(window, "mousemove", s), X.bind(window, "mouseup", l), s(e)
                }), X.bind(u.__background, "touchstart", function(e) {
                    1 === e.touches.length && (X.bind(window, "touchmove", d), X.bind(window, "touchend", c), d(e))
                }), X.addClass(u.__background, "slider"), X.addClass(u.__foreground, "slider-fg"), u.updateDisplay(), u.__background.appendChild(u.__foreground), u.domElement.appendChild(u.__background), u
            }
            return j(t, W), P(t, [{
                key: "updateDisplay",
                value: function() {
                    var e = (this.getValue() - this.__min) / (this.__max - this.__min);
                    return this.__foreground.style.width = 100 * e + "%", D(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
                }
            }]), t
        }(),
        Z = function(e) {
            function t(e, n, o) {
                F(this, t);
                var i = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                    r = i;
                return i.__button = document.createElement("div"), i.__button.innerHTML = void 0 === o ? "Fire" : o, X.bind(i.__button, "click", function(e) {
                    return e.preventDefault(), r.fire(), !1
                }), X.addClass(i.__button, "button"), i.domElement.appendChild(i.__button), i
            }
            return j(t, z), P(t, [{
                key: "fire",
                value: function() {
                    this.__onChange && this.__onChange.call(this), this.getValue().call(this.object), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue())
                }
            }]), t
        }(),
        $ = function(e) {
            function t(e, n) {
                function o(e) {
                    u(e), X.bind(window, "mousemove", u), X.bind(window, "touchmove", u), X.bind(window, "mouseup", r), X.bind(window, "touchend", r)
                }

                function i(e) {
                    _(e), X.bind(window, "mousemove", _), X.bind(window, "touchmove", _), X.bind(window, "mouseup", s), X.bind(window, "touchend", s)
                }

                function r() {
                    X.unbind(window, "mousemove", u), X.unbind(window, "touchmove", u), X.unbind(window, "mouseup", r), X.unbind(window, "touchend", r), c()
                }

                function s() {
                    X.unbind(window, "mousemove", _), X.unbind(window, "touchmove", _), X.unbind(window, "mouseup", s), X.unbind(window, "touchend", s), c()
                }

                function a() {
                    var e = R(this.value);
                    !1 !== e ? (p.__color.__state = e, p.setValue(p.__color.toOriginal())) : this.value = p.__color.toString()
                }

                function c() {
                    p.__onFinishChange && p.__onFinishChange.call(p, p.__color.toOriginal())
                }

                function u(e) {
                    -1 === e.type.indexOf("touch") && e.preventDefault();
                    var t = p.__saturation_field.getBoundingClientRect(),
                        n = e.touches && e.touches[0] || e,
                        o = n.clientX,
                        i = n.clientY,
                        r = (o - t.left) / (t.right - t.left),
                        s = 1 - (i - t.top) / (t.bottom - t.top);
                    return s > 1 ? s = 1 : s < 0 && (s = 0), r > 1 ? r = 1 : r < 0 && (r = 0), p.__color.v = s, p.__color.s = r, p.setValue(p.__color.toOriginal()), !1
                }

                function _(e) {
                    -1 === e.type.indexOf("touch") && e.preventDefault();
                    var t = p.__hue_field.getBoundingClientRect(),
                        n = 1 - ((e.touches && e.touches[0] || e).clientY - t.top) / (t.bottom - t.top);
                    return n > 1 ? n = 1 : n < 0 && (n = 0), p.__color.h = 360 * n, p.setValue(p.__color.toOriginal()), !1
                }
                F(this, t);
                var h = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
                h.__color = new I(h.getValue()), h.__temp = new I(0);
                var p = h;
                h.domElement = document.createElement("div"), X.makeSelectable(h.domElement, !1), h.__selector = document.createElement("div"), h.__selector.className = "selector", h.__saturation_field = document.createElement("div"), h.__saturation_field.className = "saturation-field", h.__field_knob = document.createElement("div"), h.__field_knob.className = "field-knob", h.__field_knob_border = "2px solid ", h.__hue_knob = document.createElement("div"), h.__hue_knob.className = "hue-knob", h.__hue_field = document.createElement("div"), h.__hue_field.className = "hue-field", h.__input = document.createElement("input"), h.__input.type = "text", h.__input_textShadow = "0 1px 1px ", X.bind(h.__input, "keydown", function(e) {
                    13 === e.keyCode && a.call(this)
                }), X.bind(h.__input, "blur", a), X.bind(h.__selector, "mousedown", function() {
                    X.addClass(this, "drag").bind(window, "mouseup", function() {
                        X.removeClass(p.__selector, "drag")
                    })
                }), X.bind(h.__selector, "touchstart", function() {
                    X.addClass(this, "drag").bind(window, "touchend", function() {
                        X.removeClass(p.__selector, "drag")
                    })
                });
                var f = document.createElement("div");
                return S.extend(h.__selector.style, {
                    width: "122px",
                    height: "102px",
                    padding: "3px",
                    backgroundColor: "#222",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
                }), S.extend(h.__field_knob.style, {
                    position: "absolute",
                    width: "12px",
                    height: "12px",
                    border: h.__field_knob_border + (h.__color.v < .5 ? "#fff" : "#000"),
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                    borderRadius: "12px",
                    zIndex: 1
                }), S.extend(h.__hue_knob.style, {
                    position: "absolute",
                    width: "15px",
                    height: "2px",
                    borderRight: "4px solid #fff",
                    zIndex: 1
                }), S.extend(h.__saturation_field.style, {
                    width: "100px",
                    height: "100px",
                    border: "1px solid #555",
                    marginRight: "3px",
                    display: "inline-block",
                    cursor: "pointer"
                }), S.extend(f.style, {
                    width: "100%",
                    height: "100%",
                    background: "none"
                }), l(f, "top", "rgba(0,0,0,0)", "#000"), S.extend(h.__hue_field.style, {
                    width: "15px",
                    height: "100px",
                    border: "1px solid #555",
                    cursor: "ns-resize",
                    position: "absolute",
                    top: "3px",
                    right: "3px"
                }), d(h.__hue_field), S.extend(h.__input.style, {
                    outline: "none",
                    textAlign: "center",
                    color: "#fff",
                    border: 0,
                    fontWeight: "bold",
                    textShadow: h.__input_textShadow + "rgba(0,0,0,0.7)"
                }), X.bind(h.__saturation_field, "mousedown", o), X.bind(h.__saturation_field, "touchstart", o), X.bind(h.__field_knob, "mousedown", o), X.bind(h.__field_knob, "touchstart", o), X.bind(h.__hue_field, "mousedown", i), X.bind(h.__hue_field, "touchstart", i), h.__saturation_field.appendChild(f), h.__selector.appendChild(h.__field_knob), h.__selector.appendChild(h.__saturation_field), h.__selector.appendChild(h.__hue_field), h.__hue_field.appendChild(h.__hue_knob), h.domElement.appendChild(h.__input), h.domElement.appendChild(h.__selector), h.updateDisplay(), h
            }
            return j(t, z), P(t, [{
                key: "updateDisplay",
                value: function() {
                    var e = R(this.getValue());
                    if (!1 !== e) {
                        var t = !1;
                        S.each(I.COMPONENTS, function(n) {
                            if (!S.isUndefined(e[n]) && !S.isUndefined(this.__color.__state[n]) && e[n] !== this.__color.__state[n]) return t = !0, {}
                        }, this), t && S.extend(this.__color.__state, e)
                    }
                    S.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                    var n = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0,
                        o = 255 - n;
                    S.extend(this.__field_knob.style, {
                        marginLeft: 100 * this.__color.s - 7 + "px",
                        marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                        backgroundColor: this.__temp.toHexString(),
                        border: this.__field_knob_border + "rgb(" + n + "," + n + "," + n + ")"
                    }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, l(this.__saturation_field, "left", "#fff", this.__temp.toHexString()), this.__input.value = this.__color.toString(), S.extend(this.__input.style, {
                        backgroundColor: this.__color.toHexString(),
                        color: "rgb(" + n + "," + n + "," + n + ")",
                        textShadow: this.__input_textShadow + "rgba(" + o + "," + o + "," + o + ",.7)"
                    })
                }
            }]), t
        }(),
        ee = ["-moz-", "-o-", "-webkit-", "-ms-", ""],
        te = {
            load: function(e, t) {
                var n = t || document,
                    o = n.createElement("link");
                o.type = "text/css", o.rel = "stylesheet", o.href = e, n.getElementsByTagName("head")[0].appendChild(o)
            },
            inject: function(e, t) {
                var n = t || document,
                    o = document.createElement("style");
                o.type = "text/css", o.innerHTML = e;
                var i = n.getElementsByTagName("head")[0];
                try {
                    i.appendChild(o)
                } catch (e) {}
            }
        },
        ne = function(e, t) {
            var n = e[t];
            return S.isArray(arguments[2]) || S.isObject(arguments[2]) ? new Y(e, t, arguments[2]) : S.isNumber(n) ? S.isNumber(arguments[2]) && S.isNumber(arguments[3]) ? S.isNumber(arguments[4]) ? new q(e, t, arguments[2], arguments[3], arguments[4]) : new q(e, t, arguments[2], arguments[3]) : S.isNumber(arguments[4]) ? new Q(e, t, {
                min: arguments[2],
                max: arguments[3],
                step: arguments[4]
            }) : new Q(e, t, {
                min: arguments[2],
                max: arguments[3]
            }) : S.isString(n) ? new J(e, t) : S.isFunction(n) ? new Z(e, t, "") : S.isBoolean(n) ? new K(e, t) : null
        },
        oe = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
            setTimeout(e, 1e3 / 60)
        },
        ie = function() {
            function e() {
                F(this, e), this.backgroundElement = document.createElement("div"), S.extend(this.backgroundElement.style, {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    top: 0,
                    left: 0,
                    display: "none",
                    zIndex: "1000",
                    opacity: 0,
                    WebkitTransition: "opacity 0.2s linear",
                    transition: "opacity 0.2s linear"
                }), X.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), S.extend(this.domElement.style, {
                    position: "fixed",
                    display: "none",
                    zIndex: "1001",
                    opacity: 0,
                    WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear",
                    transition: "transform 0.2s ease-out, opacity 0.2s linear"
                }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
                var t = this;
                X.bind(this.backgroundElement, "click", function() {
                    t.hide()
                })
            }
            return P(e, [{
                key: "show",
                value: function() {
                    var e = this;
                    this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), S.defer(function() {
                        e.backgroundElement.style.opacity = 1, e.domElement.style.opacity = 1, e.domElement.style.webkitTransform = "scale(1)"
                    })
                }
            }, {
                key: "hide",
                value: function() {
                    var e = this,
                        t = function t() {
                            e.domElement.style.display = "none", e.backgroundElement.style.display = "none", X.unbind(e.domElement, "webkitTransitionEnd", t), X.unbind(e.domElement, "transitionend", t), X.unbind(e.domElement, "oTransitionEnd", t)
                        };
                    X.bind(this.domElement, "webkitTransitionEnd", t), X.bind(this.domElement, "transitionend", t), X.bind(this.domElement, "oTransitionEnd", t), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
                }
            }, {
                key: "layout",
                value: function() {
                    this.domElement.style.left = window.innerWidth / 2 - X.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - X.getHeight(this.domElement) / 2 + "px"
                }
            }]), e
        }(),
        re = function(e) {
            if (e && "undefined" != typeof window) {
                var t = document.createElement("style");
                return t.setAttribute("type", "text/css"), t.innerHTML = e, document.head.appendChild(t), e
            }
        }(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");
    te.inject(re);
    var se = "Default",
        ae = function() {
            try {
                return !!window.localStorage
            } catch (e) {
                return !1
            }
        }(),
        le = void 0,
        de = !0,
        ce = void 0,
        ue = !1,
        _e = [],
        he = function e(t) {
            var n = this,
                o = t || {};
            this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), X.addClass(this.domElement, "dg"), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], o = S.defaults(o, {
                closeOnTop: !1,
                autoPlace: !0,
                width: e.DEFAULT_WIDTH
            }), o = S.defaults(o, {
                resizable: o.autoPlace,
                hideable: o.autoPlace
            }), S.isUndefined(o.load) ? o.load = {
                preset: se
            } : o.preset && (o.load.preset = o.preset), S.isUndefined(o.parent) && o.hideable && _e.push(this), o.resizable = S.isUndefined(o.parent) && o.resizable, o.autoPlace && S.isUndefined(o.scrollable) && (o.scrollable = !0);
            var i = ae && "true" === localStorage.getItem(m(this, "isLocal")),
                r = void 0,
                s = void 0;
            if (Object.defineProperties(this, {
                    parent: {
                        get: function() {
                            return o.parent
                        }
                    },
                    scrollable: {
                        get: function() {
                            return o.scrollable
                        }
                    },
                    autoPlace: {
                        get: function() {
                            return o.autoPlace
                        }
                    },
                    closeOnTop: {
                        get: function() {
                            return o.closeOnTop
                        }
                    },
                    preset: {
                        get: function() {
                            return n.parent ? n.getRoot().preset : o.load.preset
                        },
                        set: function(e) {
                            n.parent ? n.getRoot().preset = e : o.load.preset = e, E(this), n.revert()
                        }
                    },
                    width: {
                        get: function() {
                            return o.width
                        },
                        set: function(e) {
                            o.width = e, w(n, e)
                        }
                    },
                    name: {
                        get: function() {
                            return o.name
                        },
                        set: function(e) {
                            o.name = e, s && (s.innerHTML = o.name)
                        }
                    },
                    closed: {
                        get: function() {
                            return o.closed
                        },
                        set: function(t) {
                            o.closed = t, o.closed ? X.addClass(n.__ul, e.CLASS_CLOSED) : X.removeClass(n.__ul, e.CLASS_CLOSED), this.onResize(), n.__closeButton && (n.__closeButton.innerHTML = t ? e.TEXT_OPEN : e.TEXT_CLOSED)
                        }
                    },
                    load: {
                        get: function() {
                            return o.load
                        }
                    },
                    useLocalStorage: {
                        get: function() {
                            return i
                        },
                        set: function(e) {
                            ae && (i = e, e ? X.bind(window, "unload", r) : X.unbind(window, "unload", r), localStorage.setItem(m(n, "isLocal"), e))
                        }
                    }
                }), S.isUndefined(o.parent)) {
                if (this.closed = o.closed || !1, X.addClass(this.domElement, e.CLASS_MAIN), X.makeSelectable(this.domElement, !1), ae && i) {
                    n.useLocalStorage = !0;
                    var a = localStorage.getItem(m(this, "gui"));
                    a && (o.load = JSON.parse(a))
                }
                this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = e.TEXT_CLOSED, X.addClass(this.__closeButton, e.CLASS_CLOSE_BUTTON), o.closeOnTop ? (X.addClass(this.__closeButton, e.CLASS_CLOSE_TOP), this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0])) : (X.addClass(this.__closeButton, e.CLASS_CLOSE_BOTTOM), this.domElement.appendChild(this.__closeButton)), X.bind(this.__closeButton, "click", function() {
                    n.closed = !n.closed
                })
            } else {
                void 0 === o.closed && (o.closed = !0);
                var l = document.createTextNode(o.name);
                X.addClass(l, "controller-name"), s = c(n, l);
                X.addClass(this.__ul, e.CLASS_CLOSED), X.addClass(s, "title"), X.bind(s, "click", function(e) {
                    return e.preventDefault(), n.closed = !n.closed, !1
                }), o.closed || (this.closed = !1)
            }
            o.autoPlace && (S.isUndefined(o.parent) && (de && (ce = document.createElement("div"), X.addClass(ce, "dg"), X.addClass(ce, e.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(ce), de = !1), ce.appendChild(this.domElement), X.addClass(this.domElement, e.CLASS_AUTO_PLACE)), this.parent || w(n, o.width)), this.__resizeHandler = function() {
                n.onResizeDebounced()
            }, X.bind(window, "resize", this.__resizeHandler), X.bind(this.__ul, "webkitTransitionEnd", this.__resizeHandler), X.bind(this.__ul, "transitionend", this.__resizeHandler), X.bind(this.__ul, "oTransitionEnd", this.__resizeHandler), this.onResize(), o.resizable && y(this), r = function() {
                ae && "true" === localStorage.getItem(m(n, "isLocal")) && localStorage.setItem(m(n, "gui"), JSON.stringify(n.getSaveObject()))
            }, this.saveToLocalStorageIfPossible = r, o.parent || function() {
                var e = n.getRoot();
                e.width += 1, S.defer(function() {
                    e.width -= 1
                })
            }()
        };
    he.toggleHide = function() {
        ue = !ue, S.each(_e, function(e) {
            e.domElement.style.display = ue ? "none" : ""
        })
    }, he.CLASS_AUTO_PLACE = "a", he.CLASS_AUTO_PLACE_CONTAINER = "ac", he.CLASS_MAIN = "main", he.CLASS_CONTROLLER_ROW = "cr", he.CLASS_TOO_TALL = "taller-than-window", he.CLASS_CLOSED = "closed", he.CLASS_CLOSE_BUTTON = "close-button", he.CLASS_CLOSE_TOP = "close-top", he.CLASS_CLOSE_BOTTOM = "close-bottom", he.CLASS_DRAG = "drag", he.DEFAULT_WIDTH = 245, he.TEXT_CLOSED = "Close Controls", he.TEXT_OPEN = "Open Controls", he._keydownHandler = function(e) {
        "text" === document.activeElement.type || 72 !== e.which && 72 !== e.keyCode || he.toggleHide()
    }, X.bind(window, "keydown", he._keydownHandler, !1), S.extend(he.prototype, {
        add: function(e, t) {
            return f(this, e, t, {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
            })
        },
        addColor: function(e, t) {
            return f(this, e, t, {
                color: !0
            })
        },
        remove: function(e) {
            this.__ul.removeChild(e.__li), this.__controllers.splice(this.__controllers.indexOf(e), 1);
            var t = this;
            S.defer(function() {
                t.onResize()
            })
        },
        destroy: function() {
            if (this.parent) throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");
            this.autoPlace && ce.removeChild(this.domElement);
            var e = this;
            S.each(this.__folders, function(t) {
                e.removeFolder(t)
            }), X.unbind(window, "keydown", he._keydownHandler, !1), u(this)
        },
        addFolder: function(e) {
            if (void 0 !== this.__folders[e]) throw new Error('You already have a folder in this GUI by the name "' + e + '"');
            var t = {
                name: e,
                parent: this
            };
            t.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[e] && (t.closed = this.load.folders[e].closed, t.load = this.load.folders[e]);
            var n = new he(t);
            this.__folders[e] = n;
            var o = c(this, n.domElement);
            return X.addClass(o, "folder"), n
        },
        removeFolder: function(e) {
            this.__ul.removeChild(e.domElement.parentElement), delete this.__folders[e.name], this.load && this.load.folders && this.load.folders[e.name] && delete this.load.folders[e.name], u(e);
            var t = this;
            S.each(e.__folders, function(t) {
                e.removeFolder(t)
            }), S.defer(function() {
                t.onResize()
            })
        },
        open: function() {
            this.closed = !1
        },
        close: function() {
            this.closed = !0
        },
        hide: function() {
            this.domElement.style.display = "none"
        },
        show: function() {
            this.domElement.style.display = ""
        },
        onResize: function() {
            var e = this.getRoot();
            if (e.scrollable) {
                var t = X.getOffset(e.__ul).top,
                    n = 0;
                S.each(e.__ul.childNodes, function(t) {
                    e.autoPlace && t === e.__save_row || (n += X.getHeight(t))
                }), window.innerHeight - t - 20 < n ? (X.addClass(e.domElement, he.CLASS_TOO_TALL), e.__ul.style.height = window.innerHeight - t - 20 + "px") : (X.removeClass(e.domElement, he.CLASS_TOO_TALL), e.__ul.style.height = "auto")
            }
            e.__resize_handle && S.defer(function() {
                e.__resize_handle.style.height = e.__ul.offsetHeight + "px"
            }), e.__closeButton && (e.__closeButton.style.width = e.width + "px")
        },
        onResizeDebounced: S.debounce(function() {
            this.onResize()
        }, 50),
        remember: function() {
            if (S.isUndefined(le) && ((le = new ie).domElement.innerHTML = '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>'), this.parent) throw new Error("You can only call remember on a top level GUI.");
            var e = this;
            S.each(Array.prototype.slice.call(arguments), function(t) {
                0 === e.__rememberedObjects.length && v(e), -1 === e.__rememberedObjects.indexOf(t) && e.__rememberedObjects.push(t)
            }), this.autoPlace && w(this, this.width)
        },
        getRoot: function() {
            for (var e = this; e.parent;) e = e.parent;
            return e
        },
        getSaveObject: function() {
            var e = this.load;
            return e.closed = this.closed, this.__rememberedObjects.length > 0 && (e.preset = this.preset, e.remembered || (e.remembered = {}), e.remembered[this.preset] = x(this)), e.folders = {}, S.each(this.__folders, function(t, n) {
                e.folders[n] = t.getSaveObject()
            }), e
        },
        save: function() {
            this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = x(this), _(this, !1), this.saveToLocalStorageIfPossible()
        },
        saveAs: function(e) {
            this.load.remembered || (this.load.remembered = {}, this.load.remembered[se] = x(this, !0)), this.load.remembered[e] = x(this), this.preset = e, g(this, e, !0), this.saveToLocalStorageIfPossible()
        },
        revert: function(e) {
            S.each(this.__controllers, function(t) {
                this.getRoot().load.remembered ? p(e || this.getRoot(), t) : t.setValue(t.initialValue), t.__onFinishChange && t.__onFinishChange.call(t, t.getValue())
            }, this), S.each(this.__folders, function(e) {
                e.revert(e)
            }), e || _(this.getRoot(), !1)
        },
        listen: function(e) {
            var t = 0 === this.__listening.length;
            this.__listening.push(e), t && C(this.__listening)
        },
        updateDisplay: function() {
            S.each(this.__controllers, function(e) {
                e.updateDisplay()
            }), S.each(this.__folders, function(e) {
                e.updateDisplay()
            })
        }
    });
    var pe = {
            Color: I,
            math: N,
            interpret: R
        },
        fe = {
            Controller: z,
            BooleanController: K,
            OptionController: Y,
            StringController: J,
            NumberController: W,
            NumberControllerBox: Q,
            NumberControllerSlider: q,
            FunctionController: Z,
            ColorController: $
        },
        me = {
            dom: X
        },
        ge = {
            GUI: he
        },
        be = he,
        ve = {
            color: pe,
            controllers: fe,
            dom: me,
            gui: ge,
            GUI: be
        };
    e.color = pe, e.controllers = fe, e.dom = me, e.gui = ge, e.GUI = be, e.default = ve, Object.defineProperty(e, "__esModule", {
        value: !0
    })
});


var WallState = {
        IDLE: "idle",
        START_SHOW: "start_show",
        START_SHOW2: "start_show2",
        SHOWING: "showing"
    },
    Level = pc.createScript("level");
Level.attributes.add("levelRegular", {
    type: "asset"
}), Level.attributes.add("levelWalled", {
    type: "asset"
}), Level.attributes.add("ftue0Level", {
    type: "asset"
}), Level.attributes.add("ftue1Level", {
    type: "asset"
}), Level.attributes.add("wallPrefab", {
    type: "asset"
}), Level.attributes.add("biome0", {
    type: "asset"
}), Level.attributes.add("biome1", {
    type: "asset"
}), Level.attributes.add("biome2", {
    type: "asset"
}), Level.attributes.add("biome3", {
    type: "asset"
}), Level.attributes.add("biome4", {
    type: "asset"
}), Level.attributes.add("debugFloor", {
    type: "entity"
}), Level.attributes.add("spatialGridSize", {
    type: "vec2"
}), Level.attributes.add("walls", {
    type: "json",
    schema: [{
        name: "pauseBetween",
        type: "number"
    }, {
        name: "lifetime",
        type: "number"
    }, {
        name: "appearTime",
        type: "number"
    }]
}), Level.prototype.postInitialize = function() {
    this.manualInit()
}, Level.prototype.manualInit = function() {
    if (!this._initFlag) {
        var e;
        this._time = 0, this._wallState = WallState.IDLE, this._walls = [], this._initFlag = !0, this.currentRespawnIdx = 0, this.points = [new pc.Vec3, new pc.Vec3, new pc.Vec3, new pc.Vec3], this.playerSpawnPoints = [], this.enemySpawnPoints = [], this.selectedSpawnPoint = 0, Helper.game.state.indexOf("ftue") >= 0 ? (this.cellSize = 2, e = this[`${Helper.game.state}Level`].resource.levels[0].layerInstances, this.debugFloor.script.shaderFloor.initialize(), this.debugFloor.script.shaderFloor.material.setParameter("uTexture", this.biome4.resource), this.debugFloor.script.shaderFloor.material.update()) : (this.cellSize = Helper.game.rules.cellSize, e = this[Helper.game.rules.map].resource.levels[0].layerInstances, this.debugFloor.script.shaderFloor.initialize(), this.debugFloor.script.shaderFloor.material.setParameter("uTexture", this["biome" + Helper.game.rules.location % 5].resource), this.debugFloor.script.shaderFloor.material.update());
        var t = e[0].entityInstances,
            i = e[1],
            s = i.__cWid,
            l = i.__cHei;
        this.width = s, this.height = l, this.metersWidth = this.width * this.cellSize, this.metersHeight = this.width * this.cellSize;
        var o = 0;
        for (this._possibleTiles = [], o = 0; o < s * l; o++) this._possibleTiles.push(o);
        var a = new pc.Vec2(this.cellSize / 2, this.cellSize / 2);
        this.debugFloor.setLocalScale(s * this.cellSize, 1, l * this.cellSize), this.debugFloor.setPosition(s / 2 * this.cellSize - .55, -.7, l / 2 * this.cellSize), this._grid = new Grid(this.spatialGridSize.x, this.spatialGridSize.y, this.metersWidth, this.metersHeight);
        var r, n = new pc.Vec3;
        for (o = 0; o < i.intGrid.length; o++) {
            var h = i.intGrid[o].coordId,
                p = h % s * this.cellSize,
                c = Math.floor(h / s) * this.cellSize,
                g = this.wallPrefab.resource.instantiate();
            g.setLocalScale(this.cellSize, this.cellSize, this.cellSize), n.set(a.x + p, this.cellSize / 2 - .7, a.y + c), g.setPosition(n.x - .55, n.y, n.z), this.app.root.addChild(g), null === this._grid._staticCollision && (this._grid._staticCollision = g);
            var d = g.script.aabb;
            d.updateAABB(n.x, n.z, this.cellSize - .5, this.cellSize - .5);
            for (var _ = this._grid.aabbToSpatial(d), S = 0; S < _.length; S++) this._grid.getCell(_[S]).obstacle.push(d.entity);
            this._possibleTiles.splice(this._possibleTiles.indexOf(h), 1)
        }
        for (var y = new pc.Vec2, u = 0; u < t.length; u++) {
            var m = t[u];
            "Respawn_player" === m.__identifier && (void 0 !== m.__grid && (r = this.tileXYToPosition(m.__grid[0], m.__grid[1]), y.set(m.__grid[0], m.__grid[1])), void 0 !== m.__cx && (r = this.tileXYToPosition(m.__cx, m.__cy), y.set(m.__cx, m.__cy)), this.playerSpawnPoints.push(new pc.Vec3(r.x, 0, r.z))), "Respawn_enemy" === m.__identifier && (void 0 !== m.__grid && (r = this.tileXYToPosition(m.__grid[0], m.__grid[1]), y.set(m.__grid[0], m.__grid[1])), void 0 !== m.__cx && (r = this.tileXYToPosition(m.__cx, m.__cy), y.set(m.__cx, m.__cy)), this.enemySpawnPoints.push(new pc.Vec3(r.x, 0, r.z)));
            var v = y.x + y.y * (this.width - 1);
            this._possibleTiles.splice(this._possibleTiles.indexOf(v), 1)
        }
        if (Helper.game.rules.walls > 0)
            for (var z = 0; z < Helper.game.rules.walls; z++) {
                var f = this.wallPrefab.resource.instantiate();
                f.script.aabb.initialize(), f.setLocalScale(0, 0, 0), this.app.root.addChild(f), this._walls.push(f)
            }
    }
}, Level.prototype.tileXYToPosition = function(e, t) {
    return new pc.Vec3(e * this.cellSize + this.cellSize / 2, 0, t * this.cellSize + this.cellSize / 2)
}, Level.prototype.update = function(e) {
    if (this._initFlag) {
        var t;
        if (Helper.game.state !== GameState.MAIN_MENU && Helper.game.state !== GameState.FTUE0 && Helper.game.state !== GameState.FTUE1 && Helper.game.rules.walls > 0) {
            var i, s, l, o, a;
            e *= Helper.game.timeScale;
            new pc.Vec2(this.cellSize / 2, this.cellSize / 2);
            if (this._wallState === WallState.IDLE) this._time += e, this._time >= this.walls.pauseBetween && (this._wallState = WallState.START_SHOW, this._time = 0);
            else if (this._wallState === WallState.START_SHOW) {
                for (t = 0; t < this._walls.length; t++) i = this._walls[t], s = this.getRandomTile(), i._currentCoord = s, l = s % this.width * this.cellSize, o = Math.floor(s / this.width) * this.cellSize, a = new pc.Vec3(this.cellSize / 2 + l, this.cellSize / 2 - .7, this.cellSize / 2 + o), i.setPosition(a.x - .55, a.y, a.z), Utils.scaleBounce(i, 0, this.cellSize, this.walls.appearTime * Helper.game.timeScale);
                this._wallState = WallState.START_SHOW2
            } else if (this._wallState === WallState.START_SHOW2) {
                if (this._time += e, this._time >= this.walls.appearTime / 4) {
                    for (t = 0; t < this._walls.length; t++) {
                        l = (s = (i = this._walls[t])._currentCoord) % this.width * this.cellSize, o = Math.floor(s / this.width) * this.cellSize, a = new pc.Vec3(this.cellSize / 2 + l, this.cellSize / 2 - .7, this.cellSize / 2 + o);
                        var r = i.script.aabb;
                        r.updateAABB(a.x, a.z, this.cellSize - .5, this.cellSize - .5);
                        for (var n = this._grid.aabbToSpatial(r), h = 0; h < n.length; h++) this._grid.getCell(n[h]).obstacle.push(r.entity);
                        this._possibleTiles.splice(this._possibleTiles.indexOf(s), 1)
                    }
                    this._wallState = WallState.SHOWING, this._time = 0
                }
            } else if (this._wallState === WallState.SHOWING && (this._time += e, this._time >= this.walls.lifetime)) {
                for (t = 0; t < this._walls.length; t++) {
                    l = (s = (i = this._walls[t])._currentCoord) % this.width * this.cellSize, o = Math.floor(s / this.width) * this.cellSize, a = new pc.Vec3(this.cellSize / 2 + l, this.cellSize / 2 - .7, this.cellSize / 2 + o);
                    for (var p = this._grid.aabbToSpatial(i.script.aabb), c = 0; c < p.length; c++)
                        for (var g = this._grid.getCell(p[c]).obstacle, d = g.length - 1; d >= 0; d--) {
                            g[d].script.actor.id === i.script.actor.id && g.splice(d, 1)
                        }
                    this._possibleTiles.push(i._currentCoord), i._currentCoord = -1, Utils.scaleBounce(i, this.cellSize, 0, .3 * this.walls.appearTime * Helper.game.timeScale, "linear")
                }
                this._wallState = WallState.IDLE, this._time = 0
            }
        }
        if (Helper.game.gizmos) {
            for (var _ = 0; _ < this.spatialGridSize.x; _++) this.points[0].set(_ * this._grid.cellSize.x, 0, 0), this.points[1].set(_ * this._grid.cellSize.x, 0, this.metersHeight), Gizmo.line(this.points[0], this.points[1], Gizmo.BLUE_GIZMO);
            for (var S = 0; S < this.spatialGridSize.y; S++) this.points[0].set(0, 0, S * this._grid.cellSize.y), this.points[1].set(this.metersWidth, 0, S * this._grid.cellSize.y), Gizmo.line(this.points[0], this.points[1], Gizmo.BLUE_GIZMO);
            for (t = 0; t < this._grid.size; t++) {
                var y, u, m, v, z = this._grid.getCell(t).obstacle,
                    f = this._grid.getCell(t).hulls,
                    w = this._grid.getCell(t).spears,
                    b = this._grid.getCell(t).projectiles,
                    T = this._grid.getCell(t).triggers,
                    P = this._grid.spatialToPosition(t),
                    L = this._grid.cellSize.x - .4;
                for (d = 0; d < z.length; d++) y = P.x - L / 2, u = P.x + L / 2, m = P.z + L / 2, v = P.z - L / 2, this.points[0].set(y, 0, m), this.points[1].set(y, 0, v), this.points[2].set(u, 0, v), this.points[3].set(u, 0, m), L -= .3, Gizmo.polygon(this.points, Gizmo.CYAN_GIZMO);
                for (var x = 0; x < f.length; x++) y = P.x - L / 2, u = P.x + L / 2, m = P.z + L / 2, v = P.z - L / 2, this.points[0].set(y, 0, m), this.points[1].set(y, 0, v), this.points[2].set(u, 0, v), this.points[3].set(u, 0, m), L -= .3, Gizmo.polygon(this.points, Gizmo.MAGENTA_GIZMO);
                for (var G = 0; G < w.length; G++) y = P.x - L / 2, u = P.x + L / 2, m = P.z + L / 2, v = P.z - L / 2, this.points[0].set(y, 0, m), this.points[1].set(y, 0, v), this.points[2].set(u, 0, v), this.points[3].set(u, 0, m), L -= .3, Gizmo.polygon(this.points, Gizmo.RED_GIZMO);
                for (var H = 0; H < b.length; H++) y = P.x - L / 2, u = P.x + L / 2, m = P.z + L / 2, v = P.z - L / 2, this.points[0].set(y, 0, m), this.points[1].set(y, 0, v), this.points[2].set(u, 0, v), this.points[3].set(u, 0, m), L -= .3, Gizmo.polygon(this.points, Gizmo.YELLOW_GIZMO);
                for (var C = 0; C < T.length; C++) y = P.x - L / 2, u = P.x + L / 2, m = P.z + L / 2, v = P.z - L / 2, this.points[0].set(y, 0, m), this.points[1].set(y, 0, v), this.points[2].set(u, 0, v), this.points[3].set(u, 0, m), L -= .3, Gizmo.polygon(this.points, Gizmo.GREEN_GIZMO)
            }
        }
    }
}, Level.prototype._polygonToAABB = function(e, t) {
    for (var i = 0, s = 0; s < e.length; s++)
        for (var l = 0; l < t.length; l++) {
            var o = e[s].script.actor,
                a = e[s].script.colliderPolygon,
                r = e[s].script.aabb,
                n = t[l].script.aabb;
            o.stale || (i++, JCollision.aabbToaabb(r, n) && (i++, JCollision.polyToPoly(a.getPolygon(), n.corners) && e[s].fire("collision", t[l])))
        }
    return i
}, Level.prototype._polygonToPolygon = function(e, t) {
    for (var i = 0, s = 0; s < e.length; s++)
        for (var l = 0; l < t.length; l++) {
            var o = e[s].script.actor,
                a = t[l].script.actor;
            if (!o.stale && (!a.stale && o.id !== a.id)) {
                var r = e[s].script.aabb,
                    n = t[l].script.aabb;
                if (i++, JCollision.aabbToaabb(r, n)) {
                    i++;
                    var h = e[s].script.colliderPolygon,
                        p = t[l].script.colliderPolygon;
                    JCollision.polyToPoly(h.getPolygon(), p.getPolygon()) && (e[s].fire("collision", t[l]), t[l].fire("collision", e[s]))
                }
            }
        }
    return i
}, Level.prototype._polygonsToLines = function(e, t) {
    for (var i = 0, s = 0; s < e.length; s++)
        for (var l = 0; l < t.length; l++) {
            var o = e[s].script.actor;
            if (void 0 !== t[l].script) {
                var a = t[l].script.actor;
                if (!o.stale && !a.stale) {
                    var r = e[s].script.colliderPolygon,
                        n = t[l].script.spear.getLine();
                    i++, JCollision.polyToLine(r.getPolygon(), n[0].x, n[0].y, n[1].x, n[1].y) && e[s].fire("collision", t[l])
                }
            } else console.warn("there is no spear")
        }
    return i
}, Level.prototype._polygonsToPoints = function(e, t) {
    for (var i = 0, s = 0; s < e.length; s++)
        for (var l = 0; l < t.length; l++) {
            if (!e[s].script.actor.stale) {
                var o = e[s].script.colliderPolygon,
                    a = t[l].getPosition();
                i++, JCollision.polyToPoint(o.getPolygon(), a.x, a.z) && e[s].fire("collision", t[l])
            }
        }
    return i
}, Level.prototype._polygonToTriggers = function(e, t) {
    for (var i = 0, s = 0; s < e.length; s++)
        for (var l = 0; l < t.length; l++) {
            var o = e[s].script.actor;
            if (!o.stale && t[l].script.trigger.ownerId !== o.id) {
                var a = e[s].script.colliderPolygon,
                    r = t[l].script.colliderCircle.getCircle();
                i++, JCollision.polyToCircle(a.getPolygon(), r.center.x, r.center.y, r.radius) && e[s].fire("collision", t[l])
            }
        }
    return i
}, Level.prototype.postUpdate = function() {
    this._grid.solveSpatial();
    for (var e = 0; e < this._grid.size; e++) {
        var t = this._grid.getCell(e);
        this._polygonToAABB(t.hulls, t.obstacle), this._polygonToPolygon(t.hulls, t.hulls), this._polygonsToLines(t.hulls, t.spears), this._polygonsToPoints(t.hulls, t.projectiles), this._polygonToTriggers(t.hulls, t.triggers)
    }
}, Level.prototype.getEnemyRespawn = function(e) {
    if (this._initFlag || this.manualInit(), void 0 === e && (e = 0), e === this.enemySpawnPoints.length) return this.enemySpawnPoints[Math.floor(pc.math.random(0, this.enemySpawnPoints.length))];
    var t = Helper.playerE.getPosition();
    this.selectedSpawnPoint = Helper.math.repeat(this.selectedSpawnPoint, this.enemySpawnPoints.length);
    var i = this.enemySpawnPoints[this.selectedSpawnPoint];
    return t.distance(i) < 20 ? this.getEnemyRespawn(e + 1) : i
}, Level.prototype.getPlayerRespawn = function() {
    this._initFlag || this.manualInit();
    for (var e = Helper.playerE.getPosition(), t = 0, i = -1, s = 0; s < this.playerSpawnPoints.length; s++) {
        var l = this.playerSpawnPoints[s];
        e.distance(l) > t && (t = e.distance(l), i = s)
    }
    return this.playerSpawnPoints[i]
}, Level.prototype.getRandomTile = function() {
    return this._possibleTiles[Math.floor(pc.math.random(0, this._possibleTiles.length))]
};
var GameRules = {
        SURVIVE: "SURVIVE",
        COLLECT_COINS: "COLLECT_COINS",
        ELIMINATE_ENEMIES: "ELIMINATE_ENEMIES",
        CONSTANT_POWERUP: "CONSTANT_POWERUP",
        RANDOM_POWERUP: "RANDOM_POWERUP",
        ELIMINATE_KING: "ELIMINATE_KING",
        ELIMINATE_SPECIAL: "ELIMINATE_SPECIAL"
    },
    GameState = {
        FTUE0: "ftue0",
        FTUE1: "ftue1",
        PLAYING_FTUE: "playingFtue",
        MAIN_MENU: "mainMenu",
        COUNTDOWN: "countdown",
        PLAYING: "playing",
        RESPAWNING: "respawning",
        RESULT_SCREEN: "resultScreen"
    },
    Game = pc.createScript("game");
Game.attributes.add("lightSource", {
    type: "entity"
}), Game.attributes.add("lives", {
    type: "number"
}), Game.attributes.add("gizmos", {
    type: "boolean"
}), Game.attributes.add("timeScale", {
    type: "number"
}), Game.attributes.add("birdsView", {
    type: "boolean"
}), Game.attributes.add("skipCountdown", {
    type: "boolean"
}), Game.attributes.add("uiCounters", {
    type: "entity"
}), Game.attributes.add("uiCountdown", {
    type: "entity"
}), Game.attributes.add("uiBackdrop", {
    type: "entity"
}), Game.attributes.add("uiPlay", {
    type: "entity"
}), Game.attributes.add("uiSkipLevel", {
    type: "entity"
}), Game.attributes.add("uiShop", {
    type: "entity"
}), Game.attributes.add("uiFragIcon", {
    type: "entity"
}), Game.attributes.add("uiFragCounter", {
    type: "entity"
}), Game.attributes.add("uiHeartGroup", {
    type: "entity"
}), Game.attributes.add("uiLivesIcon", {
    type: "entity"
}), Game.attributes.add("uiLivesCounter", {
    type: "entity"
}), Game.attributes.add("uiSessionGoal", {
    type: "entity"
}), Game.attributes.add("uiKingCounter", {
    type: "entity"
}), Game.attributes.add("uiSessionTimer", {
    type: "entity"
}), Game.attributes.add("notification", {
    type: "entity"
}), Game.attributes.add("notificationText", {
    type: "entity"
}), Game.attributes.add("uiRestartFtue", {
    type: "entity"
}), Game.attributes.add("shaders", {
    type: "entity"
}), Game.attributes.add("palette", {
    type: "rgb",
    array: !0
}), Game.prototype.initialize = function() {
    if (Helper.params.resetProgress) {
        Inventory.clear();
        var e = window.location.href.replace("&resetProgress=true", "");
        window.location.href = e
    }
    if (Inventory.load(), Helper.params.realDebug) {
        Helper.dat.add(this, "gizmos"), Helper.dat.add(this, "timeScale", 0, 2), Helper.dat.add(this, "birdsView");
        var t = {
            nextLevel: function() {
                Inventory.level += 1, Inventory.save(), Helper.screenLevelIndicator.tween.kill(), Helper.game.reloadGame.apply(Helper.game)
            },
            prevLevel: function() {
                0 !== Inventory.level && (Inventory.level -= 1, Inventory.save(), Helper.screenLevelIndicator.tween.kill(), Helper.game.reloadGame.apply(Helper.game))
            },
            level: Inventory.level,
            goToLevel: function() {
                Inventory.level = this.level, Inventory.save(), Helper.screenLevelIndicator.tween.kill(), Helper.game.reloadGame.apply(Helper.game)
            },
            resetProgress: function() {
                Inventory.clear()
            }
        };
        Helper.dat.add(t, "nextLevel"), Helper.dat.add(t, "prevLevel"), Helper.dat.add(t, "level"), Helper.dat.add(t, "goToLevel");
        var pickupEnabler = function(e) {
            return {
                get [e]() {
                    return Inventory.pickups.indexOf(e) >= 0
                },
                set [e](t) {
                    t ? Inventory.pickups.push(e) : Inventory.pickups.splice(Inventory.pickups.indexOf(e), 1), Helper.pickups._pickupQueue = []
                }
            }
        };
        Helper.dat.add(pickupEnabler("powerup_nitro"), "powerup_nitro"), Helper.dat.add(pickupEnabler("powerup_shield"), "powerup_shield"), Helper.dat.add(pickupEnabler("powerup_enlarger"), "powerup_enlarger"), Helper.dat.add(pickupEnabler("powerup_sphere"), "powerup_sphere"), Helper.dat.add(pickupEnabler("powerup_smoke"), "powerup_smoke"), Helper.dat.add(pickupEnabler("powerup_shooter"), "powerup_shooter"), Helper.dat.add(t, "resetProgress")
    }
    this.uiCountdown.setLocalPosition(10, 300, 0), this.frags = 0, this.flawlessFrags = 0, this.kingFrags = 0, this.kingCounter = 0, this.ready = !1, this.uiKingCounter.enabled = !1, this.level = Inventory.level % TableProgression.levels.length, 0 === this.level ? this.ngCoefficient = 0 : this.ngCoefficient = Math.floor(Inventory.level / this.level), this.rules = TableProgression.levels[this.level], console.log(`loading rules for level ${this.level}(NG+${this.ngCoefficient}): [${JSON.stringify(this.rules)}]`), this.rules.ruleset === GameRules.ELIMINATE_SPECIAL && (this.uiHeartGroup.enabled = !1), this.rules.ruleset === GameRules.COLLECT_COINS ? this.uiSessionGoal.element.text = Locale.get("goal_collect_coins", 0, this.rules.coins) : this.rules.ruleset === GameRules.ELIMINATE_ENEMIES || this.rules.ruleset === GameRules.CONSTANT_POWERUP || this.rules.ruleset === GameRules.RANDOM_POWERUP || this.rules.ruleset === GameRules.ELIMINATE_SPECIAL ? this.uiSessionGoal.element.text = Locale.get("goal_eliminate_enemies", 0, this.rules.frags) : this.rules.ruleset === GameRules.ELIMINATE_KING ? this.uiSessionGoal.element.text = Locale.get("goal_eliminate_king", 0, this.rules.frags) : this.rules.ruleset === GameRules.SURVIVE && (this.uiSessionGoal.element.text = Locale.get("goal_survive")), this.uiSkipLevel.enabled = Inventory.lastLevelLost, Platform.userProperty({
        level: Inventory.level
    }), this.lives = this.rules.lives, this.sessionTimer = this.rules.timer, this.sessionTimerScale = 1.15, this.endSequenceStarted = !1, this.fromCameraHeight = -1, this.lastSecond = 999, this.ready = !1, this.state = GameState.MAIN_MENU, Helper.level.manualInit(), Helper.playerE.script.skinComponent.setSkin(Inventory.selectedHover, Inventory.selectedColor), this.countdownTime = 0, this.notification.setLocalPosition(0, 300, 0), this.countdownPresent = !1, this.countdownState = "startTick", this.countdownCurrent = 3, this.countdownEndSequence = 1.5, this.uiCounters.setLocalPosition(0, 180, 0), this.uiLivesCounter.element.text = this.lives, Helper.playerE.script.touchInput.disableControls(), Helper.playerE.script.touchInput.hideControls(), Helper.camera.lookClose(), this.uiPlay.children[0].element.text = Locale.get("main_menu_play"), this.uiPlay.element.once("click", (function() {
        SFX.engineCurrent("engine_normal", .015), Platform.event("session_start"), Helper.compositions.switchTo(Composition.NONE), Platform.showPreRoll().finally(function() {
            this.uiRestartFtue.enabled = !1, this.state = GameState.COUNTDOWN, Helper.playerE.script.player._state = PlayerState.RIDING, Helper.camera.launchStartSequence(), Helper.screenLevelIndicator.tween.kill(), Helper.playerE.script.touchInput.enableControls(), Helper.playerE.script.touchInput.showControls(), Inventory.ftue_controls < 2 && (this.app.touch || "true" === Helper.params.debug ? this.showNotification2("Use joystick", 1, 0, !0, !1).then(function() {
                this.showNotification2("To point your lance", 2, 0, !0, !1).then((function() {
                    Inventory.ftue_controls += 1
                }))
            }.bind(this)) : this.showNotification2("Use mouse", 1, 0, !0, !1).then(function() {
                this.showNotification2("To point your lance", 2, 0, !0, !1).then((function() {
                    Inventory.ftue_controls += 1
                }))
            }.bind(this)))
        }.bind(this))
    }), this), this.uiSkipLevel.element.once("click", (function() {
        this.uiPlay.button.active = !1,			
        GAMESDK.showAdOfEvent({
            onRewardBeforeBreak: () => {
                SFX.menuFadeEngine()
                this.uiPlay.button.active = !0
            },
            onRewardAfterBreak: () => {
                
                SFX.menuReturnEngine();
            },
            onRewardComplete: () => {
                Inventory.lastLevelLost = !1, Inventory.level += 1, Inventory.save(), Helper.screenLevelIndicator.tween.kill(), Helper.game.reloadGame.apply(Helper.game)
              
            },
            onRewardDismissed: () => {

            }
        })
    }), this), this.uiRestartFtue.enabled = !1, Utils.waitForSeconds(.1).then((function() {
        Helper.compositions.switchTo(Composition.MAIN_MENU)
    })), Helper.params.realDbug && (Helper.dat.add(this, "birdsView"), Helper.dat.add(this, "skipCountdown"), Helper.dat.add(this, "sessionTimerScale", 0, 4)), Helper.playerE.setPosition(Helper.level.getPlayerRespawn()), Helper.ai.maxEnemies = this.rules.enemiesMax, Helper.pickups.pickupMax = this.rules.pickupsMax, this.ready = !0, Platform.preloadAds()
}, Game.prototype.showNotification = function(e, t, i) {
    void 0 === t && (t = !0), void 0 === i && (i = !0), this.notificationText.element.text = e, this.notification.script.tween.play(), t && this.uiCounters.enabled && this.uiCounters.script.tween.playReverse(), Utils.waitForSeconds(1.5).then(function() {
        this.notification.script.tween.playReverse(), i && this.uiCounters.enabled && this.uiCounters.script.tween.play()
    }.bind(this))
}, Game.prototype.chainNotification = function(e, t, i, s, n) {
    if (!this.notificationInProgress) return this.showNotification2(e, t, i, s, n)
}, Game.prototype.showNotification2 = function(e, t, i, s, n, r) {
    if (void 0 === s && (s = !0), void 0 === n && (n = !0), void 0 === r && (r = !1), !this.notificationInProgress || r) {
        this.notificationInProgress = !0;
        var o = this;
        return s && o.uiCounters.enabled && o.uiCounters.script.tween.playReverse(), new Promise((function(s) {
            o.notificationText.element.text = e, o.notification.script.tween.play(), Utils.waitForSeconds(t).then((function() {
                n && o.uiCounters.enabled && o.uiCounters.script.tween.play(), o.notification.script.tween.playReverse(), Utils.waitForSeconds(i).then((function() {
                    o.notificationInProgress = !1, s()
                }))
            }))
        }))
    }
    console.error("another notification is in progress!")
}, Game.prototype.showKingCounter = function() {
    this.uiCounters.enabled && this.uiCounters.script.tween.playReverse()
}, Game.prototype.countFrag = function(e) {
    if (this.uiCounters.enabled) {
        if (Inventory.ftue_frags < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_frags = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Frags unlock new hovers", 2, 0, !0, !0).then((function() {
                Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
            })))), this.rules.ruleset === GameRules.ELIMINATE_KING && !this.lastIsPlayerKing) {
            var t = Helper.ai.current[this.lastBestScoreIdx].script.actor.id;
            console.warn("eliminate frag. enemyID: ", e, "; playerKing:", this.lastIsPlayerKing, "; currentKingidx:", this.lastBestScoreIdx, "current king id: ", t), t === e && (this.kingFrags += 1, this.uiSessionGoal.element.text = Locale.get("goal_eliminate_king", this.kingFrags, this.rules.frags), Utils.scaleBounce(this.uiSessionGoal, .95, 1, .4))
        }
        this.frags += 1, this.flawlessFrags += 1, this.uiFragIcon.script.tween.play(), this.uiFragCounter.element.text = this.frags, this.rules.ruleset === GameRules.ELIMINATE_KING && this.kingFrags >= this.rules.frags && (this.endSessionSequence(Locale.get("notify_result_eliminate_king_win")), Platform.event("session_win", {
            event_category: "engagement",
            ruleset: Helper.game.rules.ruleset,
            level: Inventory.level
        })), this.rules.ruleset === GameRules.ELIMINATE_SPECIAL && (this.uiSessionGoal.element.text = Locale.get("goal_eliminate_enemies", this.flawlessFrags, this.rules.frags), Utils.scaleBounce(this.uiSessionGoal, .95, 1, .4), this.flawlessFrags >= this.rules.frags && (this.endSessionSequence(Locale.get("notify_result_eliminate_enemies_win")), Platform.event("session_win", {
            event_category: "engagement",
            ruleset: Helper.game.rules.ruleset,
            level: Inventory.level
        }))), this.rules.ruleset !== GameRules.ELIMINATE_ENEMIES && this.rules.ruleset !== GameRules.CONSTANT_POWERUP && this.rules.ruleset !== GameRules.RANDOM_POWERUP || (this.uiSessionGoal.element.text = Locale.get("goal_eliminate_enemies", this.frags, this.rules.frags), Utils.scaleBounce(this.uiSessionGoal, .95, 1, .4), this.frags >= this.rules.frags && (this.endSessionSequence(Locale.get("notify_result_eliminate_enemies_win")), Platform.event("session_win", {
            event_category: "engagement",
            ruleset: Helper.game.rules.ruleset,
            level: Inventory.level
        })))
    }
}, Game.prototype.subtractLife = function() {
    if (this.uiCounters.enabled) {
        if (this.state === GameState.PLAYING_FTUE) {
            if (Helper.ftue0.active) return;
            if (Helper.ftue1.active) return
        }
        this.rules.ruleset === GameRules.COLLECT_COINS && (this.uiSessionGoal.element.text = Locale.get("goal_collect_coins", 0, this.rules.coins)), this.rules.ruleset === GameRules.ELIMINATE_SPECIAL ? (this.flawlessFrags = 0, this.uiSessionGoal.element.text = Locale.get("goal_eliminate_enemies", 0, this.rules.frags), Utils.scaleBounce(this.uiSessionGoal, .95, 1, .4)) : (this.lives -= 1, this.uiLivesIcon.script.tween.play(), this.uiLivesCounter.element.text = this.lives)
    }
}, Game.prototype.restoreLife = function() {
    this.lives += 1, this.uiLivesIcon.script.tween.play(), this.uiLivesCounter.element.text = this.lives
}, Game.prototype.respawnPlayer = function() {
    Helper.playerE.script.actor.stale = !1, Helper.playerE.script.skinComponent.attachToGrid(), Helper.playerE.script.player._state = PlayerState.RIDING, SFX.switchVolume(.015, 2e3), this.state === GameState.PLAYING_FTUE ? Helper.playerE.script.player.respawnInvincibilityTime = 0 : Helper.playerE.script.player.respawnInvincibilityTime = 5, Utils.launchEndlessPowerup(Helper.playerE)
}, Game.prototype.reloadGame = function() {
    Helper.reloading = !0;
    try {
        Helper.level._grid.clear()
    } catch (e) {
        console.warn("could not find level: ", Helper._cached_level)
    }
    for (; this.app.root.children.length > 0;) {
        var e = this.app.root.children[0];
        this.app.root.removeChild(e), e.destroy()
    }
    Helper.clearCache(), Utils.waitForSeconds(.2).then((function() {
        var e = pc.app.scenes.find("Main");
        pc.app.scenes.loadSceneHierarchy(e.url, (function(e, t) {
            e && console.error(e), Helper.reloading = !1, SFX.menuInitialEngine()
            
        }))
    }))
}, Game.prototype.mainMenu = function() {}, Game.prototype.countdown = function(e) {
    "startTick" === this.countdownState && (0 === this.countdownCurrent ? this.uiCountdown.children[0].element.text = Locale.get("countdown_go") : this.uiCountdown.children[0].element.text = this.countdownCurrent.toString(), Inventory.ftue_controls >= 2 && this.uiCountdown.script.tween.play(), this.countdownTime = .8, this.countdownState = "waitForEndOfTick"), this.countdownTime -= e, this.countdownTime <= 0 && ("waitForEndOfTick" === this.countdownState ? (Inventory.ftue_controls >= 2 && this.uiCountdown.script.tween.playReverse(), this.countdownTime = .26, 0 === this.countdownCurrent ? (this.state = GameState.PLAYING, this.countdownState = "startTick", Utils.launchEndlessPowerup(Helper.playerE), Helper.playerE.script.skinComponent.attachToGrid()) : this.countdownState = "waitForTickToDisappear") : "waitForTickToDisappear" === this.countdownState && (this.countdownState = "startTick", this.countdownCurrent -= 1))
}, Game.prototype.playingFtue = function(e) {}, Game.prototype.resultScreen = function(e, t) {
    this.countdownEndSequence -= t, this.zoomIn(pc.math.clamp(this.countdownEndSequence / 1.5, .1, 1))
}, Game.prototype.endSessionSequence = function(e) {
    if (!this.alreadyEndSession) {
        SFX.switchVolume(0, 2e3), this.state = GameState.RESULT_SCREEN;
        var t = this;
        this.alreadyEndSession = !0, this.notificationInProgress, this.showNotification2(e, 1, 1.5, !0, !1, !0).then((function() {
            var e = !1;
            t.rules.ruleset === GameRules.SURVIVE && t.lastIsPlayerKing && t.lives > 0 && (e = !0), t.rules.ruleset === GameRules.COLLECT_COINS && Helper.playerE.script.pickupReciever._currentExp >= t.rules.coins && (e = !0), t.rules.ruleset === GameRules.ELIMINATE_ENEMIES && t.frags >= t.rules.frags && (e = !0), t.rules.ruleset === GameRules.CONSTANT_POWERUP && t.frags >= t.rules.frags && (e = !0), t.rules.ruleset === GameRules.ELIMINATE_KING && t.frags >= t.rules.frags && (e = !0), t.rules.ruleset === GameRules.ELIMINATE_SPECIAL && t.frags >= t.rules.frags && (e = !0), t.rules.ruleset === GameRules.RANDOM_POWERUP && t.frags >= t.rules.frags && (e = !0), e ? (Inventory.level++, Inventory.lastLevelLost = !1) : Inventory.lastLevelLost = !0, Inventory.coins += Helper.playerE.script.pickupReciever._currentExp, Inventory.frags += t.frags, Inventory.save();
            var i = Inventory.nextUnlockProgress,
                s = i,
                n = Helper.tableUnlocking.nextUnlock,
                r = null;
            if (console.log("nextUnlock: ", n), n >= 0) {
                var o = Helper.tableUnlocking.unlockRates[n];
                e ? (console.log("nextUnlock: adding max rates: ", o.x), s = Math.min(1, s + o.x)) : (console.log("nextUnlock: adding min rates: ", o.y), s = Math.min(1, s + o.y)), r = Helper.tableUnlocking.previewTextures[n].resource
            }
            t.rememberUnlock(s), Helper.screenResult.show(e ? "result_header_success" : "result_header_lost", Helper.playerE.script.pickupReciever._currentExp, t.frags, i, s, r)
        }))
    }
}, Game.prototype.rememberUnlock = function(e) {
    e >= 1 ? (Inventory.nextUnlockProgress = 0, Inventory.pickups.push(Helper.tableUnlocking.itemIds[Helper.tableUnlocking.nextUnlock])) : Inventory.nextUnlockProgress = e, Inventory.save()
}, Game.prototype.zoomIn = function(e) {
    e < 1 && (this.fromCameraHeight = Helper.camera._height.value, this.endSequenceStarted = !0), this.endSequenceStarted && (this.timeScale = Helper.ease.in2(e), Helper.camera.directApply(pc.math.lerp(Helper.camera.regularHeight + 10, this.fromCameraHeight, e)))
}, Game.prototype.playing = function(e, t) {
    this.countdownTime > 0 ? (this.countdownTime -= e, this.countdownTime <= 0 && (Helper.game.notificationInProgress || this.uiCounters.script.tween.play())) : Helper.playerE.script.player._state == PlayerState.RIDING && (this.sessionTimer = Math.max(0, this.sessionTimer - e * this.sessionTimerScale));
    var i = Math.floor(this.sessionTimer / 60),
        s = Math.floor(this.sessionTimer % 60);
    Math.floor(this.sessionTimer % 1 * 100);
    if (this.sessionTimer <= 10 && (console.log(s, this.lastSecond), s < this.lastSecond)) {
        Utils.scaleBounce(this.uiSessionTimer, .9, 1, .4);
        var n = {
            value: null
        };
        gsap.fromTo(n, {
            value: 0
        }, {
            value: .8,
            duration: .2,
            ease: "elastic.out(1.55, 0.5)",
            yoyo: !0,
            repeat: 1,
            onUpdate: function() {
                this.uiSessionTimer.element.color = (new pc.Color).lerp(pc.Color.WHITE, pc.Color.RED, n.value)
            }.bind(this)
        }), this.lastSecond = s
    }
    if (i = i > 9 ? i.toString() : "0" + i.toString(), s = s > 9 ? s.toString() : "0" + s.toString(), this.uiSessionTimer.element.text = i + ":" + s, 0 !== this.sessionTimer) {
        if (!(this.state.indexOf("ftue") >= 0)) {
            var r, o = Helper.ai.current,
                l = Helper.playerE.script.pickupReciever._currentExp,
                a = -1,
                u = -1;
            for (r = 0; r < o.length; r++) o[r].script.pickupReciever._currentExp > u && (a = r, u = o[r].script.pickupReciever._currentExp);
            var c = 1,
                p = 20;
            this.rules.ruleset === GameRules.ELIMINATE_KING ? (c = 10, p = 120) : this.rules.ruleset === GameRules.SURVIVE && (c = 2, p = 40);
            var h = l > u * c && l > p;
            if (h && Inventory.ftue_king < 1 && (Helper.game.notificationInProgress || (Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("King has most ducats", 2, 0, !0, !1).then((function() {
                    Helper.game.showNotification2("For now, you are the king", 2, 0, !0, !0).then((function() {
                        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
                    }))
                })), Inventory.ftue_king = 1)), h && (a = -1), h && !this.lastIsPlayerKing && Helper.playerE.script.skinComponent._skin.crown.script.tween.play(), !h && this.lastIsPlayerKing && Helper.playerE.script.skinComponent._skin.crown.script.tween.playReverse(), this.rules.ruleset === GameRules.SURVIVE)
                if (h) {
                    if (this.uiKingCounter.enabled = !0, this.uiSessionGoal.element.text = Locale.get("goal_survive_special"), this.lastIsPlayerKing) {
                        this.kingCounter += e;
                        var m = this.kingCounter / 15;
                        this.uiKingCounter.children[0].element.width = 442 * m, this.kingCounter >= 15 && (this.endSessionSequence(Locale.get("notify_result_survive_win")), Platform.event("session_win", {
                            event_category: "engagement",
                            ruleset: Helper.game.rules.ruleset,
                            level: Inventory.level
                        }))
                    }
                } else this.kingCounter = 0, this.uiKingCounter.children[0].element.width = 0, this.uiKingCounter.enabled = !1, this.uiSessionGoal.element.text = Locale.get("goal_survive");
            this.lastBestScoreIdx !== a && (this.lastBestScoreIdx >= 0 && void 0 !== o[this.lastBestScoreIdx] && !o[this.lastBestScoreIdx].script.actor.stale && o[this.lastBestScoreIdx].script.skinComponent._skin.crown.script.tween.playReverse(), a >= 0 && o[a].script.skinComponent._skin.crown.script.tween.play()), this.lastBestScoreIdx = a, this.lastIsPlayerKing = h
        }
    } else this.rules.ruleset === GameRules.SURVIVE && this.lastIsPlayerKing ? (this.endSessionSequence(Locale.get("notify_result_survive_win")), Platform.event("session_win", {
        event_category: "engagement",
        ruleset: Helper.game.rules.ruleset,
        level: Inventory.level
    })) : this._timeoutSequence()
}, Game.prototype.ftue0 = function() {}, Game.prototype.ftue1 = function() {}, Game.prototype._timeoutSequence = function() {
    this._alreadyTimeoutSequence || (this._alreadyTimeoutSequence = !0, Helper.popupLastChance.show("time", function() {
        Helper.game.sessionTimer += 45, this._alreadyTimeoutSequence = !1
    }.bind(this), function() {
        this._alreadyTimeoutSequence = !1, this.endSessionSequence(Locale.get("notify_result_time_up")), Platform.event("session_lost", {
            event_category: "engagement",
            event_label: "timeout",
            ruleset: Helper.game.rules.ruleset,
            level: Inventory.level
        })
    }.bind(this)))
}, Game.prototype.update = function(e) {
    this.skipCountdown && this.state === GameState.COUNTDOWN && (e *= 10), this[this.state](e * this.timeScale, e)
};
var Gizmo = {
    layerObj: {
        layer: pc.app.scene.layers.getLayerById(pc.LAYERID_IMMEDIATE)
    },
    RED_GIZMO: new pc.Color(.8, .1, .1),
    GREEN_GIZMO: new pc.Color(.1, .8, .1),
    BLUE_GIZMO: new pc.Color(.1, .1, .8),
    MAGENTA_GIZMO: new pc.Color(.8, .1, .8),
    CYAN_GIZMO: new pc.Color(.1, .8, .8),
    YELLOW_GIZMO: new pc.Color(.8, .8, .1),
    _points: [new pc.Vec3, new pc.Vec3, new pc.Vec3, new pc.Vec3],
    circle: function(e, n, i, p) {
        if (!Helper.reloading && Helper.game.gizmos) {
            for (var o = 2 * Math.PI / i, t = (this.layerObj, []), c = 0; c < i; c++) {
                var r, s = (new pc.Vec3).add2(e, new pc.Vec3(n * Math.sin(o * c), 0, n * Math.cos(o * c)));
                r = c < i - 1 ? (new pc.Vec3).add2(e, new pc.Vec3(n * Math.sin(o * (c + 1)), 0, n * Math.cos(o * (c + 1)))) : (new pc.Vec3).add2(e, new pc.Vec3(n * Math.sin(0), 0, n * Math.cos(0))), t.push(s), t.push(r)
            }
            pc.app.renderLines(t, t.map((function() {
                return p
            })), this.layerObj)
        }
    },
    line: function(e, n, i) {
        Helper.reloading || Helper.game.gizmos && pc.app.renderLine(e, n, i, this.layerObj)
    },
    polygon: function(e, n) {
        if (!Helper.reloading && Helper.game.gizmos) {
            for (var i = 0; i < e.length - 1; i++) this.line(e[i], e[i + 1], n);
            this.line(e[0], e[e.length - 1], n)
        }
    },
    polygon2: function(e, n) {
        if (!Helper.reloading && Helper.game.gizmos) {
            var i = 0;
            for (i = 0; i < e.length; i++) this._points[i].set(e[i].x, 0, e[i].y);
            for (i = 0; i < this._points.length - 1; i++) this.line(this._points[i], this._points[i + 1], n);
            this.line(this._points[0], this._points[this._points.length - 1], n)
        }
    }
};
var ColliderPolygon = pc.createScript("colliderPolygon");
ColliderPolygon.attributes.add("points", {
    type: "entity",
    array: !0
}), ColliderPolygon.attributes.add("gizmoColor", {
    type: "rgb"
}), ColliderPolygon.attributes.add("manualAdd", {
    type: "boolean"
}), ColliderPolygon.prototype.postInitialize = function() {
    this.polygon = this.points.map((function(o) {
        var t = o.getPosition();
        return new pc.Vec2(t.x, t.z)
    })), this.entity.script.actor.type !== ActorType.GIZMO && this.manualAdd
}, ColliderPolygon.prototype.getPolygon = function() {
    void 0 === this.polygon && (this.polygon = this.points.map((function(o) {
        var t = o.getPosition();
        return new pc.Vec2(t.x, t.z)
    }))), 0 === this.polygon.length && (this.polygon = this.points.map((function(o) {
        var t = o.getPosition();
        return new pc.Vec2(t.x, t.z)
    })));
    for (var o = 0; o < this.points.length; o++) {
        var t = this.points[o].getPosition();
        try {
            this.polygon[o].set(t.x, t.z)
        } catch (o) {
            console.error(o)
        }
    }
    return this.polygon
}, ColliderPolygon.prototype.update = function(o) {
    Gizmo.polygon(this.points.map((function(o) {
        var t = o.getPosition();
        return new pc.Vec3(t.x, 0, t.z)
    })), this.gizmoColor)
};
var Ribbon = pc.createScript("ribbon");
Ribbon.attributes.add("lifetime", {
    type: "number",
    default: .5
}), Ribbon.attributes.add("xoffset", {
    type: "number",
    default: -.8
}), Ribbon.attributes.add("yoffset", {
    type: "number",
    default: 1
}), Ribbon.attributes.add("height", {
    type: "number",
    default: .4
});
var MAX_VERTICES = 600,
    VERTEX_SIZE = 4;
Ribbon.prototype.create = function(e) {
    this.timer = 0, this.node = null, this.vertices = [], this.vertexData = new Float32Array(MAX_VERTICES * VERTEX_SIZE), this.entity.model = null
}, Ribbon.prototype.initialize = function() {
    this.create();
    var e = {
            attributes: {
                aPositionAge: pc.SEMANTIC_POSITION
            },
            vshader: ["attribute vec4 aPositionAge;", "", "uniform mat4 matrix_viewProjection;", "uniform float trail_time;", "", "varying float vAge;", "", "void main(void)", "{", "    vAge = trail_time - aPositionAge.w;", "    gl_Position = matrix_viewProjection * vec4(aPositionAge.xyz, 1.0);", "}"].join("\n"),
            fshader: ["precision mediump float;", "", "varying float vAge;", "", "uniform float trail_lifetime;", "", "vec3 rainbow(float x)", "{", "float level = floor(x * 6.0);", "float r = float(level <= 2.0) + float(level > 4.0) * 0.5;", "float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);", "float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);", "return vec3(r, g, b);", "}", "void main(void)", "{", "    gl_FragColor = vec4(rainbow(vAge / trail_lifetime), (1.0 - (vAge / trail_lifetime)) * 0.5);", "}"].join("\n")
        },
        t = new pc.Shader(this.app.graphicsDevice, e),
        i = new pc.scene.Material;
    i.setShader(t), i.setParameter("trail_time", 0), i.setParameter("trail_lifetime", this.lifetime), i.cull = pc.CULLFACE_NONE, i.blend = !0, i.blendSrc = pc.BLENDMODE_SRC_ALPHA, i.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA, i.blendEquation = pc.BLENDEQUATION_ADD, i.depthWrite = !1;
    var r = new pc.VertexFormat(this.app.context.graphicsDevice, [{
            semantic: pc.SEMANTIC_POSITION,
            components: 4,
            type: pc.ELEMENTTYPE_FLOAT32
        }]),
        a = new pc.VertexBuffer(this.app.context.graphicsDevice, r, MAX_VERTICES * VERTEX_SIZE, pc.USAGE_DYNAMIC),
        o = new pc.scene.Mesh;
    o.vertexBuffer = a, o.indexBuffer[0] = null, o.primitive[0].type = pc.PRIMITIVE_TRISTRIP, o.primitive[0].base = 0, o.primitive[0].count = 0, o.primitive[0].indexed = !1;
    var s = new pc.scene.GraphNode,
        n = new pc.scene.MeshInstance(s, o, i);
    n.layer = pc.scene.LAYER_WORLD, n.updateKey(), this.entity.model = new pc.scene.Model, this.entity.model.graph = s, this.entity.model.meshInstances.push(n), this.model = this.entity.model, this.setNode(this.entity)
}, Ribbon.prototype.reset = function() {
    this.timer = 0, this.vertices = []
}, Ribbon.prototype.spawn = function() {
    var e = this.node,
        t = e.getPosition(),
        i = e.right.clone().scale(this.height),
        r = this.xoffset,
        a = this.yoffset;
    this.vertices.unshift({
        spawnTime: this.timer,
        vertexPair: [t.x + i.x * r, t.y + i.y * r, t.z + i.z * r, t.x + i.x * a, t.y + i.y * a, t.z + i.z * a]
    })
}, Ribbon.prototype.clearOld = function() {
    for (var e = this.vertices.length - 1; e >= 0; e--) {
        var t = this.vertices[e];
        if (!(this.timer - t.spawnTime >= this.lifetime)) return;
        this.vertices.pop()
    }
}, Ribbon.prototype.copyToArrayBuffer = function() {
    for (var e = 0; e < this.vertices.length; e++) {
        var t = this.vertices[e];
        this.vertexData[8 * e + 0] = t.vertexPair[0], this.vertexData[8 * e + 1] = t.vertexPair[1], this.vertexData[8 * e + 2] = t.vertexPair[2], this.vertexData[8 * e + 3] = t.spawnTime, this.vertexData[8 * e + 4] = t.vertexPair[3], this.vertexData[8 * e + 5] = t.vertexPair[4], this.vertexData[8 * e + 6] = t.vertexPair[5], this.vertexData[8 * e + 7] = t.spawnTime
    }
}, Ribbon.prototype.updateNumActive = function() {
    this.model.meshInstances[0].mesh.primitive[0].count = 2 * this.vertices.length
}, Ribbon.prototype.update = function(e) {
    if (this.timer += e, this.model.meshInstances[0].material.setParameter("trail_time", this.timer), this.clearOld(), this.spawn(), this.vertices.length > 1) {
        this.copyToArrayBuffer(), this.updateNumActive();
        var t = this.model.meshInstances[0].mesh.vertexBuffer;
        new Float32Array(t.lock()).set(this.vertexData), t.unlock(), this.app.scene.containsModel(this.model) || (console.log("Added model"), this.app.scene.addModel(this.model))
    } else this.app.scene.containsModel(this.model) && (console.log("Removed model"), this.app.scene.removeModel(this.model))
}, Ribbon.prototype.setNode = function(e) {
    this.node = e
};
var ActorType = {
        PLAYER: 1,
        OBSTACLE: 2,
        PICKUP: 4,
        PINATA: 8,
        WEAPON: 16,
        PROJECTILE: 32,
        TRIGGER: 64,
        GIZMO: -1
    },
    Actor = pc.createScript("actor");
Actor.attributes.add("type", {
    type: "number",
    enum: [{
        PLAYER: 1
    }, {
        OBSTACLE: 2
    }, {
        PICKUP: 4
    }, {
        PINATA: 8
    }, {
        WEAPON: 16
    }, {
        PROJECTILE: 32
    }, {
        TRIGGER: 64
    }, {
        GIZMO: -1
    }]
}), Actor.attributes.add("generatedGUID", {
    type: "boolean",
    default: !0
}), Actor.attributes.add("id", {
    type: "string"
}), Actor.attributes.add("owner", {
    type: "entity"
}), Actor.prototype.initialize = function() {
    this._initFlag || (this._initFlag = !0, this.generatedGUID && (this.id = pc.guid.create()), this.stale = !1)
}, Actor.prototype.update = function() {
    if (this.type === ActorType.PROJECTILE) {
        var t = this.entity.getPosition();
        Gizmo.circle(t, .5, 12, Gizmo.CYAN_GIZMO)
    }
};
var JCollision = {
    aabbToaabb: function(t, o) {
        return t.left < o.right && t.right > o.left && t.top > o.bottom && t.bottom < o.top
    },
    pointToaabb: function(t, o) {
        return t.x > o.left && t.x < o.right && t.y > o.bottom && t.y < o.top
    },
    polyToPoly: function(t, o) {
        for (var n = 0, r = 0; r < t.length; r++) {
            (n = r + 1) === t.length && (n = 0);
            var i = t[r],
                e = t[n],
                l = this.polyToLine(o, i.x, i.y, e.x, e.y);
            if (l) return !0;
            if (l = this.polyToPoint(t, o[0].x, o[0].y)) return !0
        }
        return !1
    },
    polyToCircle: function(t, o, n, r) {
        if (this.polyToPoint(t, o, n)) return !0;
        for (var i = t.length, e = 0; e < i - 1; e++)
            if (this.lineToCircle(t[e].x, t[e].y, t[e + 1].x, t[e + 1].y, o, n, r)) return !0;
        return this.lineToCircle(t[0].x, t[0].y, t[i - 1].x, t[i - 1].y, o, n, r)
    },
    polyToLine: function(t, o, n, r, i) {
        for (var e = 0, l = 0; l < t.length; l++) {
            (e = l + 1) === t.length && (e = 0);
            var y = t[l].x,
                u = t[l].y,
                f = t[e].x,
                h = t[e].y;
            if (this.lineToLine(o, n, r, i, y, u, f, h)) return !0
        }
        return !1
    },
    polyToPoint: function(t, o, n) {
        for (var r = !1, i = 0, e = 0; e < t.length; e++) {
            (i = e + 1) == t.length && (i = 0);
            var l = t[e],
                y = t[i];
            (l.y > n && y.y < n || l.y < n && y.y > n) && o < (y.x - l.x) * (n - l.y) / (y.y - l.y) + l.x && (r = !r)
        }
        return r
    },
    lineToLine: function(t, o, n, r, i, e, l, y) {
        var u = ((l - i) * (o - e) - (y - e) * (t - i)) / ((y - e) * (n - t) - (l - i) * (r - o)),
            f = ((n - t) * (o - e) - (r - o) * (t - i)) / ((y - e) * (n - t) - (l - i) * (r - o));
        return u >= 0 && u <= 1 && f >= 0 && f <= 1
    },
    dot: function(t, o) {
        return t[0] * o[0] + t[1] * o[1]
    },
    lineToCircle: function(t, o, n, r, i, e, l) {
        var y = [i - t, e - o],
            u = [n - t, r - o],
            f = this.dot(u, u),
            h = this.dot(y, u) / f,
            a = [u[0] * (h = (h = h < 0 ? 0 : h) > 1 ? 1 : h) + t - i, u[1] * h + o - e];
        return this.dot(a, a) <= l * l
    }
};
var ColliderType = {
        CIRCLE: "COLLIDER_CIRCLE",
        POLYGON: "COLLIDER_POLYGON",
        DOT: "COLLIDER_DOT"
    },
    Hitting = pc.createScript("hitting");

function withPoly(i, e) {
    if (e.colliderType === ColliderType.POLYGON) return JCollision.polyToPoly(i, e.getCollider());
    if (e.colliderType === ColliderType.CIRCLE) {
        var t = e.getCollider();
        return JCollision.polyToCircle(i, t.center.x, t.center.y, t.radius)
    }
    throw "unknown collider type: " + e.colliderType
}

function withCircle(i, e) {
    if (e.colliderType === ColliderType.POLYGON) return JCollision.polyToCircle(e.getCollider(), i.center.x, i.center.y, i.radius);
    if (e.colliderType !== ColliderType.CIRCLE) throw "unknown collider type: " + e.colliderType
}
Hitting.prototype.initialize = function() {
    this.actors = [], this.weapons = [], this.environment = [], this.mapping = {
        [ActorType.PLAYER]: "actors",
        [ActorType.OBSTACLE]: "environment",
        [ActorType.PINATA]: "environment",
        [ActorType.WEAPON]: "weapons"
    }
}, Hitting.prototype.add = function(i, e, t, o) {
    this[this.mapping[e.type]].push({
        entity: i,
        actor: e,
        colliderType: t,
        getCollider: o
    })
}, Hitting.prototype.remove = function(i) {
    for (var e = this[this.mapping[i.type]], t = 0; t < e.length; t++) e[t].actor.id === i.id && e.splice(t, 1)
}, Hitting.prototype.collide = function(i, e) {
    for (var t, o, l = 0, r = 0; r < this[i].length; r++)
        for (var n = 0; n < this[e].length; n++) t = this[i][r], o = this[e][n], t.actor.id !== o.actor.id && (o.actor.stale || t.actor.stale || (t.colliderType === ColliderType.POLYGON ? (l++, withPoly(t.getCollider(), o) && (t.entity.fire("collision", o.entity), o.entity.fire("collision", t.entity))) : t.colliderType === ColliderType.CIRCLE && (l++, withCircle(t.getCollider(), o) && (t.entity.fire("collision", o.entity), o.entity.fire("collision", t.entity)))));
    return l
}, Hitting.prototype.postUpdate = function(i) {
    var e = Date.now(),
        t = Date.now() - e;
    t > 2 && console.log("collisions: ", 0, "spent: ", t)
};
var ColliderCircle = pc.createScript("colliderCircle");
ColliderCircle.attributes.add("radius", {
    type: "number"
}), ColliderCircle.prototype.postInitialize = function() {
    this._collider = {
        center: new pc.Vec2,
        radius: this.radius
    }, this._corners = [new pc.Vec2, new pc.Vec2, new pc.Vec2, new pc.Vec2]
}, ColliderCircle.prototype.getCircle = function() {
    var i = this.entity.getPosition();
    return this._collider.center.set(i.x, i.z), this._collider.radius = this.radius, this._collider
}, ColliderCircle.prototype.getCorners = function() {
    var i = this.entity.getPosition();
    return this._corners[0].set(i.x - this.radius, i.z + this.radius), this._corners[1].set(i.x - this.radius, i.z - this.radius), this._corners[2].set(i.x + this.radius, i.z - this.radius), this._corners[3].set(i.x + this.radius, i.z + this.radius), this._corners
};
var Pickup = pc.createScript("pickup");
Pickup.attributes.add("pickupType", {
    type: "string",
    default: "COIN",
    enum: [{
        COIN: "COIN"
    }, {
        SHIELD: "SHIELD"
    }, {
        NITRO: "NITRO"
    }, {
        ENLARGER: "ENLARGER"
    }, {
        SPHERE: "SPHERE"
    }, {
        SMOKE: "SMOKE"
    }, {
        SHOOTER: "SHOOTER"
    }]
}), Pickup.attributes.add("pickupClass", {
    type: "string",
    default: "COIN",
    enum: [{
        COIN: "COIN"
    }, {
        POWERUP: "POWERUP"
    }]
}), Pickup.attributes.add("visual", {
    type: "entity"
}), Pickup.attributes.add("materials", {
    type: "asset",
    array: !0
}), Pickup.attributes.add("matcapMaterial", {
    type: "string"
}), Pickup.attributes.add("matcapShades", {
    type: "rgb",
    array: !0
}), Pickup.attributes.add("frenel", {
    type: "json",
    schema: [{
        name: "powerup",
        type: "string",
        array: !0
    }, {
        name: "color",
        type: "rgb",
        array: !0
    }, {
        name: "mesh",
        type: "asset",
        array: !0
    }]
}), Pickup.attributes.add("rotation", {
    type: "number"
}), Pickup.attributes.add("speed", {
    type: "vec2"
}), Pickup.attributes.add("speedUpTime", {
    type: "number"
}), Pickup.attributes.add("speedCurve", {
    type: "curve"
}), Pickup.attributes.add("scale", {
    type: "vec2"
}), Pickup.attributes.add("scaleCurve", {
    type: "curve"
}), Pickup.attributes.add("pickupProximity", {
    type: "number"
}), Pickup.attributes.add("arcLength", {
    type: "number",
    default: 2
}), Pickup.attributes.add("arcHeight", {
    type: "number",
    default: 2
}), Pickup.attributes.add("arcTime", {
    type: "number",
    default: 2
}), Pickup.attributes.add("rollSpeed", {
    type: "number",
    default: 1
}), Pickup.attributes.add("rollTime", {
    type: "number",
    default: .5
});
var PickupState = {
    SELECT_DIR: "selectDir",
    FIRST_ARC: "firstArc",
    SECOND_ARC: "secondArc",
    ROLL: "roll",
    IDLE: "idle",
    FLYING: "flying",
    DESTROYING: "destroying"
};
Pickup.prototype.initialize = function() {
    this._inited = !1, this.entity.on("pool_spawn", this.onSpawn, this), this.currentArcLength = 0, this.currentArcTime = 0, this.direction = new pc.Vec3, this.from = new pc.Vec3, this.control = new pc.Vec3, this.to = new pc.Vec3, this.frenel && this.frenel.color && this.frenel.color.length > 0 ? (this.shader = Helper.game.shaders.findByName("Frensel").script.shaderFrensel.getShaderInstance(), this.entity.setLocalEulerAngles(0, 0, 45)) : (this.matcapMaterial && this.matcapMaterial.length > 0 && (this.shader = Helper.game.shaders.findByName(this.matcapMaterial).script.shaderMatcap.getShaderInstance(), this.visual.model.meshInstances[0].material = this.shader.material, this.shader.injectMeshInsance([this.visual.model.meshInstances[0]]), this.shader.update()), this.entity.setLocalEulerAngles(0, 0, 10))
}, Pickup.prototype.debugGug = function(t) {
    var e = this.frenel.powerup.indexOf(t),
        i = this.frenel.color[e],
        s = this.frenel.mesh[e];
    this.visual.model.asset = s, this.visual.model.meshInstances[0].material = this.shader.material, this.shader.injectMeshInsance([this.visual.model.meshInstances[0]]), this.shader.update(), this.shader.color = i, this.shader.update(), this._state = "debug"
}, Pickup.prototype.onSpawn = function(t, e, i, s) {
    if (this._inited = !0, this._state = void 0 === t ? PickupState.IDLE : t, this._value = void 0 === e ? 1 : e, this._time = 0, this._target = null, this._dir = new pc.Vec3, this.entity.setLocalScale(1, 1, 1), void 0 !== s && (this.pickupType = s), this.frenel && this.frenel.color && this.frenel.color.length > 0) {
        var r = this.frenel.powerup.indexOf(this.pickupType),
            a = this.frenel.color[r],
            h = this.frenel.mesh[r];
        this.visual.model.asset = h, this.visual.model.meshInstances[0].material = this.shader.material, this.shader.injectMeshInsance([this.visual.model.meshInstances[0]]), this.shader.update(), this.shader.color = a, this.shader.update()
    } else this.matcapMaterial && this.matcapMaterial.length > 0 ? (this.shader.tint = void 0 !== i ? this.matcapShades[i] : this.matcapShades[0], this.shader.update()) : void 0 !== i || null !== this.visual && (this.visual.model.meshInstances[0].material = this.materials[0].resource);
    this._state === PickupState.IDLE && Helper.level._grid.attachPickup(this.entity), this.entity.script.actor.stale = !1
}, Pickup.prototype.destroying = function() {}, Pickup.prototype.startGather = function(t) {
    Helper.pickups.subtractPickup(), Helper.level._grid.removePickup(this.entity), this._state = PickupState.FLYING, this._target = t, this.entity.script.actor.stale = !0
}, Pickup.prototype.idle = function(t) {
    this.visual.rotateLocal(0, this.rotation * t, 0);
    var e = Helper.ai.current,
        i = Helper.playerE,
        s = this.entity.getPosition();
    if (!i.script.actor.stale && i.getPosition().distance(s) < this.pickupProximity) this.startGather(i);
    else
        for (var r = 0; r < e.length; r++)
            if (!e[r].script.actor.stale && e[r].getPosition().distance(s) < this.pickupProximity) return void this.startGather(e[r])
}, Pickup.prototype.selectDir = function(t) {
    var e = pc.math.random(0, 360) * (Math.PI / 180);
    this.direction.set(Math.sin(e), 0, Math.cos(e)).normalize(), this.currentArcLength = pc.math.random(.8 * this.arcLength, 1.2 * this.arcLength), this.currentArcTime = pc.math.random(.8 * this.arcTime, 1.2 * this.arcTime);
    var i = this.entity.getPosition();
    this.from.set(i.x, i.y, i.z), this.to.set(i.x + this.direction.x * this.currentArcLength, 0, i.z + this.direction.z * this.currentArcLength);
    var s = Helper.level._grid.positionToSpatialBounds(this.to.x, this.to.z);
    this.direction.x *= s.x, this.direction.z *= s.y, this.to.set(i.x + this.direction.x * this.currentArcLength, 0, i.z + this.direction.z * this.currentArcLength), this.control.set((this.from.x + this.to.x) / 2, this.arcHeight, (this.from.z + this.to.z) / 2), this._time = 0, this._state = PickupState.FIRST_ARC
}, Pickup.prototype.firstArc = function(t) {
    var e = Math.min(this._time / this.currentArcTime, 1),
        i = Helper.math.bezier(this.from, this.control, this.to, e);
    if (this.entity.setPosition(i), this.visual.rotateLocal(0, this.rotation * t * 2, 0), e >= 1) {
        var s = this.entity.getPosition();
        this.from.set(s.x, s.y, s.z), this.to.set(s.x + this.direction.x * this.currentArcLength * .4, 0, s.z + this.direction.z * this.currentArcLength * .4);
        var r = Helper.level._grid.positionToSpatialBounds(this.to.x, this.to.z);
        this.direction.x *= r.x, this.direction.z *= r.y, this.to.set(s.x + this.direction.x * this.currentArcLength * .4, 0, s.z + this.direction.z * this.currentArcLength * .4), this.control.set((this.from.x + this.to.x) / 2, .5 * this.arcHeight, (this.from.z + this.to.z) / 2), this._time = 0, this._state = PickupState.SECOND_ARC
    } else this._time += t
}, Pickup.prototype.secondArc = function(t) {
    var e = Math.min(this._time / (.6 * this.currentArcTime), 1),
        i = Helper.math.bezier(this.from, this.control, this.to, e);
    this.entity.setPosition(i), this.visual.rotateLocal(0, this.rotation * t * 1.5, 0), e >= 1 ? (this._time = 0, this._state = PickupState.ROLL) : this._time += t
}, Pickup.prototype.roll = function(t) {
    if (this._time >= this.rollTime) return this._time = 0, this._state = PickupState.IDLE, void Helper.level._grid.attachPickup(this.entity);
    this._time += t;
    var e = 1 - this._time / this.rollTime,
        i = this.entity.getPosition(),
        s = Helper.level._grid.positionToSpatialBounds(i.x, i.z);
    this.direction.x *= s.x, this.direction.z *= s.y, this.entity.setPosition(i.x + this.direction.x * this.rollSpeed * e * t, i.y, i.z + this.direction.z * this.rollSpeed * e * t), this.idle(t)
}, Pickup.prototype.flying = function(t) {
    this._time = Math.min(this._time + t, this.speedUpTime);
    var e = this._target.getPosition(),
        i = this.entity.getPosition();
    if (i.distance(e) < .5) return this._target.fire("pickup", this.pickupType, this._value), this._state = PickupState.DESTROYING, this._time = 0, void this.entity.script.poolItem.despawn();
    var s = Helper.vec3.dir(i, e, this._dir).normalize(),
        r = this._time / this.speedUpTime,
        a = this.speedCurve.value(r),
        h = pc.math.lerp(this.speed.x, this.speed.y, a) * t,
        n = this.scaleCurve.value(r),
        c = pc.math.lerp(this.scale.x, this.scale.y, n);
    this.entity.setLocalScale(c, c, c);
    var o = s.scale(h);
    this.entity.setPosition(i.x + o.x, i.y + o.y, i.z + o.z)
}, Pickup.prototype.debug = function() {}, Pickup.prototype.postUpdate = function(t) {
    if (this._inited) {
        if (Helper.reloading && (this.wasReloading = !0), !this.wasReloading) return t *= Helper.game.timeScale, Helper.game.state === GameState.COUNTDOWN || Helper.game.state === GameState.FTUE0 || Helper.game.state === GameState.FTUE1 ? this.visual.rotateLocal(0, this.rotation * t, 0) : void this[this._state](t);
        this.entity.destroy()
    }
};
var DirectorPickup = pc.createScript("directorPickup");
DirectorPickup.attributes.add("spawnPerFrame", {
    type: "number"
}), DirectorPickup.attributes.add("spawnRadius", {
    type: "number"
}), DirectorPickup.attributes.add("pickupKeys", {
    type: "string",
    array: !0
}), DirectorPickup.attributes.add("pickupWeight", {
    type: "number",
    array: !0
}), DirectorPickup.attributes.add("pickupMax", {
    type: "number"
}), DirectorPickup.attributes.add("startPickups", {
    type: "number"
}), DirectorPickup.attributes.add("spawnAtOnce", {
    type: "vec2"
}), DirectorPickup.attributes.add("tick", {
    type: "vec2"
}), DirectorPickup.prototype.postInitialize = function() {
    this._time = 0, this._pickups = 0, this._pickupQueue = [], this._nextTick = pc.math.random(this.tick.x, this.tick.y), this._spawnOffset = new pc.Vec2, this._cachedV3 = new pc.Vec3, this._wantToSpawn = this.startPickups, this._excluded = Helper.game.rules.excludePickup || [], this.enqueuePickups()
}, DirectorPickup.prototype.enqueuePickups = function() {
    this._pickupQueue = [];
    for (var t = 0; t < this.pickupWeight.length; t++)
        for (var e = 0; e < this.pickupWeight[t]; e++) this._excluded.indexOf(this.pickupKeys[t]) > -1 || Inventory.pickups.indexOf(this.pickupKeys[t]) >= 0 && this._pickupQueue.push(t);
    this._pickupQueue = Helper.shuffle(this._pickupQueue)
}, DirectorPickup.prototype.spawn = function(t) {
    for (var e = 0; e < t; e++) {
        if (this._pickups >= this.pickupMax) return;
        0 === this._pickupQueue.length && this.enqueuePickups(), this.spawnOne(), this._pickups++
    }
}, DirectorPickup.prototype.spawnOne = function() {
    var t = Helper.level.cellSize,
        e = this._pickupQueue.shift(),
        i = Helper.level.getRandomTile(),
        p = pc.math.clamp(i % Helper.level.width, 2, Helper.level.width - 2),
        s = pc.math.clamp(Math.floor(i / Helper.level.width), 2, Helper.level.height - 2),
        c = new pc.Vec3(p * t + t / 2, 0, s * t + t / 2);
    return this._spawnOffset.set(c.x, c.z), this._spawnOffset = Helper.math.randomInCircle(2, this._spawnOffset), this._cachedV3.set(c.x + this._spawnOffset.x, 0, c.z + this._spawnOffset.y), this.pickupKeys[e].indexOf("powerup") >= 0 ? Helper.pool.spawn("pickup_powerup", this._cachedV3, void 0, void 0, void 0, this.pickupKeys[e].split("_")[1]) : Helper.pool.spawn(this.pickupKeys[e], this._cachedV3)
}, DirectorPickup.prototype.subtractPickup = function() {
    this._pickups--
}, DirectorPickup.prototype.update = function(t) {
    if (Helper.game.state !== GameState.MAIN_MENU && Helper.game.state !== GameState.FTUE0 && Helper.game.state !== GameState.FTUE1) {
        if (t *= Helper.game.timeScale, this._time += t, this._time >= this._nextTick) {
            this._time = 0, this._nextTick = pc.math.random(this.tick.x, this.tick.y);
            var e = pc.math.random(this.spawnAtOnce.x, this.spawnAtOnce.y);
            this._wantToSpawn += e
        }
        this._wantToSpawn > 0 && (this._wantToSpawn < this.spawnPerFrame ? (this._wantToSpawn = 0, this.spawn(this._wantToSpawn)) : (this._wantToSpawn = Math.max(0, this._wantToSpawn - 1), this.spawn(this.spawnPerFrame)))
    }
};
var DirectorAi = pc.createScript("directorAi");
DirectorAi.attributes.add("startEnemies", {
    type: "number"
}), DirectorAi.attributes.add("maxEnemies", {
    type: "number"
}), DirectorAi.attributes.add("fromToTick", {
    type: "vec2"
}), DirectorAi.prototype.postInitialize = function() {
    this.current = [], this.addHistory = [], this.spliceHistory = [], this.time = 0, this.nextTime = pc.math.random(this.fromToTick.x, this.fromToTick.y), this.targeted2 = {}
}, DirectorAi.prototype.spawnOne = function() {
    if (!(this.current.length >= this.maxEnemies)) {
        var t = Helper.level.getEnemyRespawn();
        if (null !== t) {
            var e = Helper.pool.spawn("enemy", t);
            return this.current.push(e), this.addHistory.push(e.script.actor.id), e
        }
        console.warn("no eligible spawn points :(")
    }
}, DirectorAi.prototype.removeOne = function(t) {
    for (i = 0; i < this.current.length; i++)
        if (this.current[i].script.actor.id === t) return this.current.splice(i, 1), void this.spliceHistory.push(t);
    console.error("actor", t, "was not spliced from current! vot eto da"), console.error("has actors though: "), this.current.map((function(t) {
        console.warn(t.script.actor.id)
    })), console.log(this.addHistory), console.log(this.spliceHistory)
}, DirectorAi.prototype.update = function(t) {
    Helper.game.state !== GameState.MAIN_MENU && Helper.game.state !== GameState.COUNTDOWN && Helper.game.state !== GameState.FTUE0 && Helper.game.state !== GameState.FTUE1 && Helper.game.state !== GameState.PLAYING_FTUE && (Helper.reloading || (this.time += t * Helper.game.timeScale, this.time >= this.nextTime && (this.spawnOne(), this.time = 0, this.nextTime = pc.math.random(this.fromToTick.x, this.fromToTick.y))))
};
var EnemyState = {
        FIND_TARGET: "findTarget",
        FOLLOW_TARGET: "followTarget",
        TRAVEL: "travel",
        DESTROYING: "destroying",
        DESTROYED: "destroyed"
    },
    Enemy = pc.createScript("enemy");
Enemy.attributes.add("steer", {
    type: "vec2"
}), Enemy.attributes.add("maxFollowTime", {
    type: "number"
}), Enemy.attributes.add("maxTravelTime", {
    type: "number"
}), Enemy.prototype.initialize = function() {
    this.entity.on("pool_spawn", this.onSpawn, this), this.entity.on("collision", this.onCollision, this)
}, Enemy.prototype.onSpawn = function() {
    this.input = new pc.Vec2(1, 1).normalize(), this._time = 0, this._target = null, this._travelTarget = -1, this._state = EnemyState.FIND_TARGET, this.entity.script.actor.stale = !1
}, Enemy.prototype.onCollision = function(t) {
    t.script.actor.type === ActorType.OBSTACLE && (this._state = EnemyState.DESTROYING), t.script.actor.type === ActorType.PLAYER && (this._state = EnemyState.DESTROYING), t.script.actor.type === ActorType.WEAPON && (this._state = EnemyState.DESTROYING), t.script.actor.type === ActorType.PROJECTILE && (this._state = EnemyState.DESTROYING)
}, Enemy.prototype.findTarget = function() {
    var t = this.entity.getPosition(),
        e = Helper.level._grid.positionToSpatial(t.x, t.z);
    if (-1 === e) return this._state = EnemyState.TRAVEL, void(this._travelTarget = Math.floor(pc.math.random(0, Helper.level._grid.size)));
    var i = Helper.level._grid.getCell(e);
    void 0 === i && console.error("cannot find anything in cell", e);
    for (var a = null, s = null, r = 0; r < i.hulls.length; r++) {
        var n = i.hulls[r],
            o = n.script.actor.id;
        if (o !== this.entity.script.actor.id && (!Helper.ai.targeted2[o] && this._lastTarget !== o)) {
            a = n;
            break
        }
    }
    for (var h in i.pickups) s = i.pickups[h];
    if (s && a) Math.random() < .3 ? this._target = a : this._target = s;
    else if (a) this._target = a;
    else {
        if (!s) return this._state = EnemyState.TRAVEL, void(this._travelTarget = Math.floor(pc.math.random(0, Helper.level._grid.size)));
        this._target = s
    }
    this._lastTarget = this._target.script.actor.id, this._state = EnemyState.FOLLOW_TARGET
}, Enemy.prototype.travel = function(t) {
    if (this._time += t, this._time > this.maxTravelTime) return this._travelTarget = -1, this._state = EnemyState.FIND_TARGET, void(this._time = 0);
    var e = this.entity.getPosition();
    if (Helper.level._grid.positionToSpatial(e.x, e.z) === this._travelTarget) return this._state = EnemyState.FIND_TARGET, this._time = 0, void(this._travelTarget = -1);
    this._steer(Helper.level._grid.spatialToPosition(this._travelTarget), t)
}, Enemy.prototype.followTarget = function(t) {
    return this._time += t, this._time > this.maxFollowTime ? (this._target = null, this._state = EnemyState.FIND_TARGET, void(this._time = 0)) : this._target && this._target.script ? this._target.script.actor.stale ? (this._target = null, this._state = EnemyState.FIND_TARGET, void(this._time = 0)) : void this._steer(this._target.getPosition(), t) : (this._state = EnemyState.FIND_TARGET, void(this._time = 0))
}, Enemy.prototype.destroying = function() {}, Enemy.prototype._steer = function(t, e) {
    var i = this.entity.getPosition();
    Gizmo.line(i, t, Gizmo.RED_GIZMO);
    var a = (new pc.Vec3).sub2(t, i),
        s = Math.atan2(-this.input.x, -this.input.y),
        r = Math.atan2(a.x, a.z),
        n = Helper.math.angleDiffSigned(r * pc.math.RAD_TO_DEG, s * pc.math.RAD_TO_DEG);
    Gizmo.line(i, i.clone().add(new pc.Vec3(Math.sin(s), 0, Math.cos(s)).scale(2)), Gizmo.CYAN_GIZMO), Gizmo.line(i, i.clone().add(new pc.Vec3(Math.sin(r), 0, Math.cos(r)).scale(2)), Gizmo.BLUE_GIZMO);
    var o = pc.math.lerp(this.steer.x, this.steer.y, Math.abs(n) / 180) * e,
        h = Math.min(Math.abs(n), o),
        l = (s * pc.math.RAD_TO_DEG + h * Helper.math.sign(n)) * pc.math.DEG_TO_RAD;
    Gizmo.line(i, i.clone().add(new pc.Vec3(Math.sin(l), 0, Math.cos(l)).scale(2)), Gizmo.MAGENTA_GIZMO), this.input.set(-Math.sin(l), -Math.cos(l)).normalize()
}, Enemy.prototype.update = function(t) {
    Helper.reloading && (this.wasReloading = !0), this.wasReloading ? this.entity.destroy() : (t *= Helper.game.timeScale, this[this._state](t))
};
var PinataState = {
        IDLE: "idle",
        DESTROYING: "destroying",
        DESTROYED: "destroyed"
    },
    Pinata = pc.createScript("pinata");
Pinata.attributes.add("pickupPrefab", {
    type: "entity"
}), Pinata.attributes.add("deathFx", {
    type: "entity"
}), Pinata.attributes.add("visual", {
    type: "entity"
}), Pinata.prototype.initialize = function() {
    this._state = PinataState.IDLE, this._time = 0, this.entity.on("collision", this.onCollision, this)
}, Pinata.prototype.onCollision = function(t) {
    t.script.actor.type === ActorType.WEAPON && (console.log("weapon collision"), this.deathFx.particlesystem.play(), this.visual.model.enabled = !1, this._state = PinataState.DESTROYING, this.entity.script.actor.stale = !0)
}, Pinata.prototype.idle = function(t) {}, Pinata.prototype.destroying = function() {
    Helper.hitting.remove(this.entity.script.actor), this._state = PinataState.DESTROYED
}, Pinata.prototype.destroyed = function(t) {
    this._time += t, this._time > 1 && this.entity.destroy()
}, Pinata.prototype.update = function(t) {
    Helper.isReloading || (t *= Helper.game.timeScale, this[this._state](t))
};
var PickupReciever = pc.createScript("pickupReciever");
PickupReciever.attributes.add("scale", {
    type: "vec2"
}), PickupReciever.attributes.add("duration", {
    type: "number"
}), PickupReciever.attributes.add("elasticArgs", {
    type: "vec2"
}), PickupReciever.attributes.add("uiFill", {
    type: "entity"
}), PickupReciever.attributes.add("uiText", {
    type: "entity"
}), PickupReciever.attributes.add("uiHeartIcon", {
    type: "entity"
}), PickupReciever.attributes.add("uiHeartCounter", {
    type: "entity"
}), PickupReciever.attributes.add("uiCoinIcon", {
    type: "entity"
}), PickupReciever.attributes.add("uiCoinCounter", {
    type: "entity"
}), PickupReciever.attributes.add("uiVingette", {
    type: "entity"
}), PickupReciever.prototype.initialize = function() {
    this._time = null, this._tween = null, this._coinUITween = null, this._scale = {
        value: this.scale.y
    }, this._uiCoinScale = {
        value: 1
    }, "player" === this.entity.script.actor.id ? this._currentExp = 0 : this._currentExp = Math.floor(pc.math.random(5, 20)), this._currentLevel = 0, this._tempProgression = [5, 20, 50, 80, 120], this._displayOnUI(), this._opacityTimer = 0, this._opacityDirection = 0, this.entity.on("pickup", (function(e, t) {
        !0 !== this.entity.script.actor.stale && (this.restartTween(), "player" === this.entity.script.actor.id && (this._opacityDirection = 1, this._opacityTimer = 0), this[e.toLowerCase()](t), SFX.playVariance(`add_${e.toLowerCase()}`))
    }), this)
}, PickupReciever.prototype.restartTween = function() {
    this._tween && (this._tween.kill(), this._tween = null);
    var e = this.scale.y;
    this._tween = gsap.fromTo(this._scale, {
        value: e - .2 * e
    }, {
        value: e,
        duration: this.duration,
        ease: "elastic.out(" + this.elasticArgs.x + ", " + this.elasticArgs.y + ")"
    })
}, PickupReciever.prototype.restartCoinUITween = function() {
    "player" === this.entity.script.actor.id && (SFX.playVariance("coin", this.entity), Helper.shaderFloor.radius = 4, this._coinUITween && (this._coinUITween.kill(), this._coinUITween = null), this._coinUITween = gsap.fromTo(this._uiCoinScale, {
        value: .8
    }, {
        value: 1,
        duration: this.duration,
        ease: "elastic.out(" + this.elasticArgs.x + ", " + this.elasticArgs.y + ")",
        onUpdate: function() {
            Helper.reloading || (Helper.shaderFloor.brightness = Math.max(0, 1 - 2 * this._time), Helper.shaderFloor.radius = Math.max(0, 4 - 4 * this._time))
        }
    }))
}, PickupReciever.prototype.coin = function(e) {
    this._currentExp += e, "player" === this.entity.script.actor.id && (Inventory.ftue_coins < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_coins = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Ducats unlock new colors", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), Helper.game.rules.ruleset === GameRules.COLLECT_COINS && (Helper.game.uiSessionGoal.element.text = Locale.get("goal_collect_coins", this._currentExp, Helper.game.rules.coins), Utils.scaleBounce(Helper.game.uiSessionGoal, .95, 1, .4), this._currentExp >= Helper.game.rules.coins && (Helper.game.endSessionSequence(Locale.get("notify_result_collect_coins_win")), Platform.event("session_win", {
        event_category: "engagement",
        ruleset: Helper.game.rules.ruleset,
        level: Inventory.level
    })))), this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (this.restartCoinUITween(), this._displayOnUI())
}, PickupReciever.prototype._displayOnUI = function() {
    for (var e = -1, t = 0; t < this._tempProgression.length; t++) {
        if (this._currentExp < this._tempProgression[t]) {
            e = Math.min(this._tempProgression.length - 1, t);
            break
        }
        this._currentExp >= this._tempProgression[t] && t == this._tempProgression.length - 1 && (e = this._tempProgression.length - 1)
    }
    if (this._currentLevel = e, "player" === this.entity.script.actor.id)
        if (this.uiCoinCounter.element.text = this._currentExp.toString(), this._currentLevel === this._tempProgression.length - 1) this.uiFill.element.anchor = new pc.Vec4(0, 0, 1, 1), this.uiText.element.text = "LEVEL " + (e + 1);
        else {
            var i = this._currentExp - (e > 0 ? this._tempProgression[e - 1] : 0),
                r = this._tempProgression[e] - (e > 0 ? this._tempProgression[e - 1] : 0);
            this.uiFill.element.anchor = new pc.Vec4(0, 0, i / r, 1), this.uiText.element.text = "LEVEL " + (e + 1)
        }
}, PickupReciever.prototype.shield = function() {
    "player" === this.entity.script.actor.id && Inventory.ftue_pickup_shield < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_pickup_shield = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Shield gives invincibility", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), this.entity.script.shield.launch()
}, PickupReciever.prototype.nitro = function() {
    "player" === this.entity.script.actor.id && Inventory.ftue_pickup_nitro < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_pickup_nitro = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Nitro gives speed", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), this.entity.script.powerupNitro.launch()
}, PickupReciever.prototype.enlarger = function() {
    "player" === this.entity.script.actor.id && Inventory.ftue_pickup_enlarger < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_pickup_enlarger = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Your lance has enlarged", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), this.entity.script.powerupEnlarger.launch()
}, PickupReciever.prototype.sphere = function() {
    "player" === this.entity.script.actor.id && Inventory.ftue_pickup_sphere < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_pickup_sphere = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Sphere destroys", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), this.entity.script.powerupSphere.launch()
}, PickupReciever.prototype.smoke = function() {
    "player" === this.entity.script.actor.id && Inventory.ftue_pickup_smoke < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_pickup_smoke = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Smoke slows down", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), this.entity.script.powerupSmoke.launch()
}, PickupReciever.prototype.shooter = function() {
    "player" === this.entity.script.actor.id && Inventory.ftue_pickup_shooter < 1 && (Helper.game.notificationInProgress || (Inventory.ftue_pickup_shooter = 1, Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .1, 1, "linear"), Helper.game.showNotification2("Gun shoots", 2, 0, !0, !0).then((function() {
        Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, 1, 1, "linear")
    })))), this.entity.script.powerupShooter.launch()
}, PickupReciever.prototype.mine = function() {}, PickupReciever.prototype.diamond = function() {}, PickupReciever.prototype.dropAllSilent = function() {
    this._currentExp = 0, this._displayOnUI()
}, PickupReciever.prototype.dropAll = function() {
    var e, t = this.entity.getPosition(),
        i = 0,
        r = 0,
        n = 0,
        c = 0;
    for (this._currentExp < 10 ? i = this._currentExp : this._currentExp < 50 ? (r = Math.floor(Math.min(this._currentExp, .7 * this._currentExp) / 5), i = this._currentExp - 5 * r) : this._currentExp < 100 ? (n = Math.floor(Math.min(this._currentExp, .7 * this._currentExp) / 10), this._currentExp -= 10 * n, r = Math.floor(this._currentExp / 5), i = this._currentExp - 5 * r) : (c = Math.floor(Math.min(this._currentExp, .7 * this._currentExp) / 50), this._currentExp -= 50 * c, n = Math.floor(Math.min(this._currentExp, .7 * this._currentExp) / 10), this._currentExp -= 10 * n, r = Math.floor(this._currentExp / 5), i = this._currentExp - 5 * r), this._currentExp = 0, e = 0; e < c; e++) Helper.pool.spawn("pickup_coin", t, PickupState.SELECT_DIR, 50, 3), Helper.pickups._pickups++;
    for (e = 0; e < n; e++) Helper.pool.spawn("pickup_coin", t, PickupState.SELECT_DIR, 10, 2), Helper.pickups._pickups++;
    for (e = 0; e < r; e++) Helper.pool.spawn("pickup_coin", t, PickupState.SELECT_DIR, 5, 1), Helper.pickups._pickups++;
    for (e = 0; e < i; e++) Helper.pool.spawn("pickup_coin", t, PickupState.SELECT_DIR, 1, 0), Helper.pickups._pickups++;
    this._displayOnUI()
}, PickupReciever.prototype.postUpdate = function(e) {
    if (this.entity.script.skinComponent.getSkin().hullVisual.setLocalScale(this._scale.value, this._scale.value, this._scale.value), "player" === this.entity.script.actor.id) {
        if (0 !== this._opacityDirection) {
            pc.math.clamp(0 + this._opacityDirection * e * Helper.game.timeScale * 4, 0, 1);
            this._opacityTimer = pc.math.clamp(this._opacityTimer + this._opacityDirection * e * Helper.game.timeScale, 0, .25), .25 === this._opacityTimer && (this._opacityDirection = -1), 0 === this._opacityTimer && (this._opacityDirection = 0)
        }
        this.uiCoinIcon.setLocalScale(this._uiCoinScale.value, this._uiCoinScale.value, this._uiCoinScale.value)
    }
};
/*!
 * GSAP 3.2.0
 * https://greensock.com
 * 
 * @license Copyright 2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */
! function(e, a) {
    "object" == typeof exports && "undefined" != typeof module ? a(exports) : "function" == typeof define && define.amd ? define(["exports"], a) : a((e = e || self).window = e.window || {})
}(this, (function(e) {
    "use strict";

    function _inheritsLoose(e, a) {
        e.prototype = Object.create(a.prototype), (e.prototype.constructor = e).__proto__ = a
    }

    function _assertThisInitialized(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
    }

    function n(e) {
        return "string" == typeof e
    }

    function o(e) {
        return "function" == typeof e
    }

    function p(e) {
        return "number" == typeof e
    }

    function q(e) {
        return void 0 === e
    }

    function r(e) {
        return "object" == typeof e
    }

    function s(e) {
        return !1 !== e
    }

    function t() {
        return "undefined" != typeof window
    }

    function u(e) {
        return o(e) || n(e)
    }

    function K(e) {
        return (y = Tt(e, pt)) && ce
    }

    function L(e, a) {
        return console.warn("Invalid property", e, "set to", a, "Missing plugin? gsap.registerPlugin()")
    }

    function M(e, a) {
        return !a && console.warn(e)
    }

    function N(e, a) {
        return e && (pt[e] = a) && y && (y[e] = a) || pt
    }

    function O() {
        return 0
    }

    function Y(e) {
        var a, c, d = e[0];
        if (r(d) || o(d) || (e = [e]), !(a = (d._gsap || {}).harness)) {
            for (c = bt.length; c-- && !bt[c].targetTest(d););
            a = bt[c]
        }
        for (c = e.length; c--;) e[c] && (e[c]._gsap || (e[c]._gsap = new Vt(e[c], a))) || e.splice(c, 1);
        return e
    }

    function Z(e) {
        return e._gsap || Y(Pt(e))[0]._gsap
    }

    function $(e, a) {
        var c = e[a];
        return o(c) ? e[a]() : q(c) && e.getAttribute(a) || c
    }

    function _(e, a) {
        return (e = e.split(",")).forEach(a) || e
    }

    function aa(e) {
        return Math.round(1e5 * e) / 1e5 || 0
    }

    function ba(e, a) {
        for (var c = a.length, d = 0; e.indexOf(a[d]) < 0 && ++d < c;);
        return d < c
    }

    function ca(e, a, c) {
        var d, v = p(e[1]),
            y = (v ? 2 : 1) + (a < 2 ? 0 : 1),
            w = e[y];
        if (v && (w.duration = e[1]), w.parent = c, a) {
            for (d = w; c && !("immediateRender" in d);) d = c.vars.defaults || {}, c = s(c.vars.inherit) && c.parent;
            w.immediateRender = s(d.immediateRender), a < 2 ? w.runBackwards = 1 : w.startAt = e[y - 1]
        }
        return w
    }

    function da() {
        var e, a, c = mt.length,
            d = mt.slice(0);
        for (gt = {}, e = mt.length = 0; e < c; e++)(a = d[e]) && a._lazy && (a.render(a._lazy[0], a._lazy[1], !0)._lazy = 0)
    }

    function ea(e, a, c, d) {
        mt.length && da(), e.render(a, c, d), mt.length && da()
    }

    function fa(e) {
        var a = parseFloat(e);
        return (a || 0 === a) && (e + "").match(dt).length < 2 ? a : e
    }

    function ga(e) {
        return e
    }

    function ha(e, a) {
        for (var c in a) c in e || (e[c] = a[c]);
        return e
    }

    function ia(e, a) {
        for (var c in a) c in e || "duration" === c || "ease" === c || (e[c] = a[c])
    }

    function ka(e, a) {
        for (var c in a) e[c] = r(a[c]) ? ka(e[c] || (e[c] = {}), a[c]) : a[c];
        return e
    }

    function la(e, a) {
        var c, d = {};
        for (c in e) c in a || (d[c] = e[c]);
        return d
    }

    function pa(e, a, c, d) {
        void 0 === c && (c = "_first"), void 0 === d && (d = "_last");
        var v = a._prev,
            y = a._next;
        v ? v._next = y : e[c] === a && (e[c] = y), y ? y._prev = v : e[d] === a && (e[d] = v), a._dp = e, a._next = a._prev = a.parent = null
    }

    function qa(e, a) {
        !e.parent || a && !e.parent.autoRemoveChildren || e.parent.remove(e), e._act = 0
    }

    function ra(e) {
        for (var a = e; a;) a._dirty = 1, a = a.parent;
        return e
    }

    function ua(e) {
        return e._repeat ? Mt(e._tTime, e = e.duration() + e._rDelay) * e : 0
    }

    function wa(e, a) {
        return (e - a._start) * a._ts + (0 <= a._ts ? 0 : a._dirty ? a.totalDuration() : a._tDur)
    }

    function xa(e) {
        return e._end = aa(e._start + (e._tDur / Math.abs(e._ts || e._pauseTS || J) || 0))
    }

    function ya(e, a, c) {
        if (a.parent && qa(a), a._start = aa(c + a._delay), a._end = aa(a._start + (a.totalDuration() / Math.abs(a.timeScale()) || 0)), function _addLinkedListItem(e, a, c, d, v) {
                void 0 === c && (c = "_first"), void 0 === d && (d = "_last");
                var y, w = e[d];
                if (v)
                    for (y = a[v]; w && w[v] > y;) w = w._prev;
                w ? (a._next = w._next, w._next = a) : (a._next = e[c], e[c] = a), a._next ? a._next._prev = a : e[d] = a, a._prev = w, a.parent = e
            }(e, a, "_first", "_last", e._sort ? "_start" : 0), (e._recent = a)._time || !a._dur && a._initted) {
            var d = (e.rawTime() - a._start) * a._ts;
            (!a._dur || Ot(0, a.totalDuration(), d) - a._tTime > J) && a.render(d, !0)
        }
        if (ra(e)._dp && e._initted && e._time >= e._dur && e._ts) {
            if (e._dur < e.duration())
                for (var v = e; v._dp;) 0 <= v.rawTime() && v.totalTime(v._tTime, !0), v = v._dp;
            e._zTime = -J
        }
        return e
    }

    function za(e, a, c, d) {
        return Qt(e, a), e._initted ? !c && e._pt && (e._dur && !1 !== e.vars.lazy || !e._dur && e.vars.lazy) && b !== Rt.frame ? (mt.push(e), e._lazy = [a, d], 1) : void 0 : 1
    }

    function Ca(e, a, c) {
        var d = e._repeat,
            v = aa(a);
        return e._dur = v, e._tDur = d ? d < 0 ? 1e12 : aa(v * (d + 1) + e._rDelay * d) : v, c || ra(e.parent), e.parent && xa(e), e
    }

    function Da(e) {
        return e instanceof Gt ? ra(e) : Ca(e, e._dur)
    }

    function Fa(e, a) {
        var c, d, v = e.labels,
            y = e._recent || kt,
            w = e.duration() >= H ? y.endTime(!1) : e._dur;
        return n(a) && (isNaN(a) || a in v) ? "<" === (c = a.charAt(0)) || ">" === c ? ("<" === c ? y._start : y.endTime(0 <= y._repeat)) + (parseFloat(a.substr(1)) || 0) : (c = a.indexOf("=")) < 0 ? (a in v || (v[a] = w), v[a]) : (d = +(a.charAt(c - 1) + a.substr(c + 1)), 1 < c ? Fa(e, a.substr(0, c - 1)) + d : w + d) : null == a ? w : +a
    }

    function Ga(e, a) {
        return e || 0 === e ? a(e) : a
    }

    function Ia(e) {
        return (e + "").substr((parseFloat(e) + "").length)
    }

    function La(e, a) {
        return e && r(e) && "length" in e && (!a && !e.length || e.length - 1 in e && r(e[0])) && !e.nodeType && e !== c
    }

    function Oa(e) {
        return e.sort((function() {
            return .5 - Math.random()
        }))
    }

    function Pa(e) {
        if (o(e)) return e;
        var a = r(e) ? e : {
                each: e
            },
            c = Yt(a.ease),
            d = a.from || 0,
            v = parseFloat(a.base) || 0,
            y = {},
            w = 0 < d && d < 1,
            b = isNaN(d) || w,
            T = a.axis,
            C = d,
            P = d;
        return n(d) ? C = P = {
                center: .5,
                edges: .5,
                end: 1
            }[d] || 0 : !w && b && (C = d[0], P = d[1]),
            function(e, w, S) {
                var A, E, D, z, F, R, B, I, V, U = (S || a).length,
                    G = y[U];
                if (!G) {
                    if (!(V = "auto" === a.grid ? 0 : (a.grid || [1, H])[1])) {
                        for (B = -H; B < (B = S[V++].getBoundingClientRect().left) && V < U;);
                        V--
                    }
                    for (G = y[U] = [], A = b ? Math.min(V, U) * C - .5 : d % V, E = b ? U * P / V - .5 : d / V | 0, I = H, R = B = 0; R < U; R++) D = R % V - A, z = E - (R / V | 0), G[R] = F = T ? Math.abs("y" === T ? z : D) : rt(D * D + z * z), B < F && (B = F), F < I && (I = F);
                    "random" === d && Oa(G), G.max = B - I, G.min = I, G.v = U = (parseFloat(a.amount) || parseFloat(a.each) * (U < V ? U - 1 : T ? "y" === T ? U / V : V : Math.max(V, U / V)) || 0) * ("edges" === d ? -1 : 1), G.b = U < 0 ? v - U : v, G.u = Ia(a.amount || a.each) || 0, c = c && U < 0 ? Nt(c) : c
                }
                return U = (G[e] - G.min) / G.max || 0, aa(G.b + (c ? c(U) : U) * G.v) + G.u
            }
    }

    function Qa(e) {
        var a = e < 1 ? Math.pow(10, (e + "").length - 2) : 1;
        return function(c) {
            return ~~(Math.round(parseFloat(c) / e) * e * a) / a + (p(c) ? 0 : Ia(c))
        }
    }

    function Ra(e, a) {
        var c, d, v = st(e);
        return !v && r(e) && (c = v = e.radius || H, e.values ? (e = Pt(e.values), (d = !p(e[0])) && (c *= c)) : e = Qa(e.increment)), Ga(a, v ? o(e) ? function(a) {
            return d = e(a), Math.abs(d - a) <= c ? d : a
        } : function(a) {
            for (var v, y, w = parseFloat(d ? a.x : a), b = parseFloat(d ? a.y : 0), T = H, C = 0, P = e.length; P--;)(v = d ? (v = e[P].x - w) * v + (y = e[P].y - b) * y : Math.abs(e[P] - w)) < T && (T = v, C = P);
            return C = !c || T <= c ? e[C] : a, d || C === a || p(a) ? C : C + Ia(a)
        } : Qa(e))
    }

    function Sa(e, a, c, d) {
        return Ga(st(e) ? !a : !0 === c ? !!(c = 0) : !d, (function() {
            return st(e) ? e[~~(Math.random() * e.length)] : (c = c || 1e-5) && (d = c < 1 ? Math.pow(10, (c + "").length - 2) : 1) && ~~(Math.round((e + Math.random() * (a - e)) / c) * c * d) / d
        }))
    }

    function Wa(e, a, c) {
        return Ga(c, (function(c) {
            return e[~~a(c)]
        }))
    }

    function Za(e) {
        for (var a, c, d, v, y = 0, w = ""; ~(a = e.indexOf("random(", y));) d = e.indexOf(")", a), v = "[" === e.charAt(a + 7), c = e.substr(a + 7, d - a - 7).match(v ? dt : ot), w += e.substr(y, a - y) + Sa(v ? c : +c[0], +c[1], +c[2] || 1e-5), y = d + 1;
        return w + e.substr(y, e.length - y)
    }

    function ab(e, a, c) {
        var d, v, y, w = e.labels,
            b = H;
        for (d in w)(v = w[d] - a) < 0 == !!c && v && b > (v = Math.abs(v)) && (y = d, b = v);
        return y
    }

    function cb(e) {
        return qa(e), e.progress() < 1 && At(e, "onInterrupt"), e
    }

    function hb(e, a, c) {
        return (6 * (e = e < 0 ? e + 1 : 1 < e ? e - 1 : e) < 1 ? a + (c - a) * e * 6 : e < .5 ? c : 3 * e < 2 ? a + (c - a) * (2 / 3 - e) * 6 : a) * Et + .5 | 0
    }

    function ib(e, a, c) {
        var d, v, y, w, b, T, C, P, S, A, E = e ? p(e) ? [e >> 16, e >> 8 & Et, e & Et] : 0 : Dt.black;
        if (!E) {
            if ("," === e.substr(-1) && (e = e.substr(0, e.length - 1)), Dt[e]) E = Dt[e];
            else if ("#" === e.charAt(0)) 4 === e.length && (e = "#" + (d = e.charAt(1)) + d + (v = e.charAt(2)) + v + (y = e.charAt(3)) + y), E = [(e = parseInt(e.substr(1), 16)) >> 16, e >> 8 & Et, e & Et];
            else if ("hsl" === e.substr(0, 3))
                if (E = A = e.match(ot), a) {
                    if (~e.indexOf("=")) return E = e.match(ut), c && E.length < 4 && (E[3] = 1), E
                } else w = +E[0] % 360 / 360, b = E[1] / 100, d = 2 * (T = E[2] / 100) - (v = T <= .5 ? T * (b + 1) : T + b - T * b), 3 < E.length && (E[3] *= 1), E[0] = hb(w + 1 / 3, d, v), E[1] = hb(w, d, v), E[2] = hb(w - 1 / 3, d, v);
            else E = e.match(ot) || Dt.transparent;
            E = E.map(Number)
        }
        return a && !A && (d = E[0] / Et, v = E[1] / Et, y = E[2] / Et, T = ((C = Math.max(d, v, y)) + (P = Math.min(d, v, y))) / 2, C === P ? w = b = 0 : (S = C - P, b = .5 < T ? S / (2 - C - P) : S / (C + P), w = C === d ? (v - y) / S + (v < y ? 6 : 0) : C === v ? (y - d) / S + 2 : (d - v) / S + 4, w *= 60), E[0] = ~~(w + .5), E[1] = ~~(100 * b + .5), E[2] = ~~(100 * T + .5)), c && E.length < 4 && (E[3] = 1), E
    }

    function jb(e) {
        var a = [],
            c = [],
            d = -1;
        return e.split(zt).forEach((function(e) {
            var v = e.match(ht) || [];
            a.push.apply(a, v), c.push(d += v.length + 1)
        })), a.c = c, a
    }

    function kb(e, a, c) {
        var d, v, y, w, b = "",
            T = (e + b).match(zt),
            C = a ? "hsla(" : "rgba(",
            P = 0;
        if (!T) return e;
        if (T = T.map((function(e) {
                return (e = ib(e, a, 1)) && C + (a ? e[0] + "," + e[1] + "%," + e[2] + "%," + e[3] : e.join(",")) + ")"
            })), c && (y = jb(e), (d = c.c).join(b) !== y.c.join(b)))
            for (w = (v = e.replace(zt, "1").split(ht)).length - 1; P < w; P++) b += v[P] + (~d.indexOf(P) ? T.shift() || C + "0,0,0,0)" : (y.length ? y : T.length ? T : c).shift());
        if (!v)
            for (w = (v = e.split(zt)).length - 1; P < w; P++) b += v[P] + T[P];
        return b + v[w]
    }

    function nb(e) {
        var a, c = e.join(" ");
        if (zt.lastIndex = 0, zt.test(c)) return a = Ft.test(c), e[1] = kb(e[1], a), e[0] = kb(e[0], a, jb(e[1])), !0
    }

    function yb(e, a, c, d) {
        void 0 === c && (c = function easeOut(e) {
            return 1 - a(1 - e)
        }), void 0 === d && (d = function easeInOut(e) {
            return e < .5 ? a(2 * e) / 2 : 1 - a(2 * (1 - e)) / 2
        });
        var v, y = {
            easeIn: a,
            easeOut: c,
            easeInOut: d
        };
        return _(e, (function(e) {
            for (var a in It[e] = pt[e] = y, It[v = e.toLowerCase()] = c, y) It[v + ("easeIn" === a ? ".in" : "easeOut" === a ? ".out" : ".inOut")] = It[e + "." + a] = y[a]
        })), y
    }

    function zb(e) {
        return function(a) {
            return a < .5 ? (1 - e(1 - 2 * a)) / 2 : .5 + e(2 * (a - .5)) / 2
        }
    }

    function Ab(e, a, c) {
        function Vk(e) {
            return 1 === e ? 1 : d * Math.pow(2, -10 * e) * at((e - y) * v) + 1
        }
        var d = 1 <= a ? a : 1,
            v = (c || (e ? .3 : .45)) / (a < 1 ? a : 1),
            y = v / tt * (Math.asin(1 / d) || 0),
            w = "out" === e ? Vk : "in" === e ? function(e) {
                return 1 - Vk(1 - e)
            } : zb(Vk);
        return v = tt / v, w.config = function(a, c) {
            return Ab(e, a, c)
        }, w
    }

    function Bb(e, a) {
        function bl(e) {
            return e ? --e * e * ((a + 1) * e + a) + 1 : 0
        }
        void 0 === a && (a = 1.70158);
        var c = "out" === e ? bl : "in" === e ? function(e) {
            return 1 - bl(1 - e)
        } : zb(bl);
        return c.config = function(a) {
            return Bb(e, a)
        }, c
    }
    var a, c, d, v, y, w, b, T, C, P, S, A, E, D, z, F, R, B, I, V, U, G, X, Q = {
            autoSleep: 120,
            force3D: "auto",
            nullTargetWarn: 1,
            units: {
                lineHeight: ""
            }
        },
        W = {
            duration: .5,
            overwrite: !1,
            delay: 0
        },
        H = 1e8,
        J = 1 / H,
        tt = 2 * Math.PI,
        et = tt / 4,
        nt = 0,
        rt = Math.sqrt,
        it = Math.cos,
        at = Math.sin,
        st = Array.isArray,
        ot = /(?:-?\.?\d|\.)+/gi,
        ut = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g,
        ht = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
        lt = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi,
        ft = /\(([^()]+)\)/i,
        ct = /[+-]=-?[\.\d]+/,
        dt = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
        pt = {},
        _t = {},
        mt = [],
        gt = {},
        vt = {},
        yt = {},
        wt = 30,
        bt = [],
        xt = "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
        Tt = function _merge(e, a) {
            for (var c in a) e[c] = a[c];
            return e
        },
        Mt = function _animationCycle(e, a) {
            return (e /= a) && ~~e === e ? ~~e - 1 : ~~e
        },
        kt = {
            _start: 0,
            endTime: O
        },
        Ot = function _clamp(e, a, c) {
            return c < e ? e : a < c ? a : c
        },
        Ct = [].slice,
        Pt = function toArray(e, a) {
            return !n(e) || a || !d && Bt() ? st(e) ? function _flatten(e, a, c) {
                return void 0 === c && (c = []), e.forEach((function(e) {
                    return n(e) && !a || La(e, 1) ? c.push.apply(c, Pt(e)) : c.push(e)
                })) || c
            }(e, a) : La(e) ? Ct.call(e, 0) : e ? [e] : [] : Ct.call(v.querySelectorAll(e), 0)
        },
        St = function mapRange(e, a, c, d, v) {
            var y = a - e,
                w = d - c;
            return Ga(v, (function(a) {
                return c + (a - e) / y * w
            }))
        },
        At = function _callback(e, a, c) {
            var d, v, y = e.vars,
                w = y[a];
            if (w) return d = y[a + "Params"], v = y.callbackScope || e, c && mt.length && da(), d ? w.apply(v, d) : w.call(v)
        },
        Et = 255,
        Dt = {
            aqua: [0, Et, Et],
            lime: [0, Et, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, Et],
            navy: [0, 0, 128],
            white: [Et, Et, Et],
            olive: [128, 128, 0],
            yellow: [Et, Et, 0],
            orange: [Et, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [Et, 0, 0],
            pink: [Et, 192, 203],
            cyan: [0, Et, Et],
            transparent: [Et, Et, Et, 0]
        },
        zt = function() {
            var e, a = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (e in Dt) a += "|" + e + "\\b";
            return new RegExp(a + ")", "gi")
        }(),
        Ft = /hsl[a]?\(/,
        Rt = (D = Date.now, z = 500, F = 33, R = D(), B = R, V = I = 1 / 240, E = {
            time: 0,
            frame: 0,
            tick: function tick() {
                _j(!0)
            },
            wake: function wake() {
                w && (!d && t() && (c = d = window, v = c.document || {}, pt.gsap = ce, (c.gsapVersions || (c.gsapVersions = [])).push(ce.version), K(y || c.GreenSockGlobals || !c.gsap && c || {}), A = c.requestAnimationFrame), P && E.sleep(), S = A || function(e) {
                    return setTimeout(e, 1e3 * (V - E.time) + 1 | 0)
                }, C = 1, _j(2))
            },
            sleep: function sleep() {
                (A ? c.cancelAnimationFrame : clearTimeout)(P), C = 0, S = O
            },
            lagSmoothing: function lagSmoothing(e, a) {
                z = e || 1e8, F = Math.min(a, z, 0)
            },
            fps: function fps(e) {
                I = 1 / (e || 240), V = E.time + I
            },
            add: function add(e) {
                U.indexOf(e) < 0 && U.push(e), Bt()
            },
            remove: function remove(e) {
                var a;
                ~(a = U.indexOf(e)) && U.splice(a, 1)
            },
            _listeners: U = []
        }),
        Bt = function _wake() {
            return !C && Rt.wake()
        },
        It = {},
        Lt = /^[\d.\-M][\d.\-,\s]/,
        qt = /["']/g,
        Nt = function _invertEase(e) {
            return function(a) {
                return 1 - e(1 - a)
            }
        },
        Yt = function _parseEase(e, a) {
            return e && (o(e) ? e : It[e] || function vb(e) {
                var a = (e + "").split("("),
                    c = It[a[0]];
                return c && 1 < a.length && c.config ? c.config.apply(null, ~e.indexOf("{") ? [function _parseObjectInString(e) {
                    for (var a, c, d, v = {}, y = e.substr(1, e.length - 3).split(":"), w = y[0], b = 1, T = y.length; b < T; b++) c = y[b], a = b !== T - 1 ? c.lastIndexOf(",") : c.length, d = c.substr(0, a), v[w] = isNaN(d) ? d.replace(qt, "").trim() : +d, w = c.substr(a + 1).trim();
                    return v
                }(a[1])] : ft.exec(e)[1].split(",").map(fa)) : It._CE && Lt.test(e) ? It._CE("", e) : c
            }(e)) || a
        };

    function _j(e) {
        var a, c, d = D() - B,
            v = !0 === e;
        z < d && (R += d - F), B += d, E.time = (B - R) / 1e3, (0 < (a = E.time - V) || v) && (E.frame++, V += a + (I <= a ? .004 : I - a), c = 1), v || (P = S(_j)), c && U.forEach((function(a) {
            return a(E.time, d, E.frame, e)
        }))
    }

    function sl(e) {
        return e < X ? G * e * e : e < .7272727272727273 ? G * Math.pow(e - 1.5 / 2.75, 2) + .75 : e < .9090909090909092 ? G * (e -= 2.25 / 2.75) * e + .9375 : G * Math.pow(e - 2.625 / 2.75, 2) + .984375
    }
    _("Linear,Quad,Cubic,Quart,Quint,Strong", (function(e, a) {
        var c = a < 5 ? a + 1 : a;
        yb(e + ",Power" + (c - 1), a ? function(e) {
            return Math.pow(e, c)
        } : function(e) {
            return e
        }, (function(e) {
            return 1 - Math.pow(1 - e, c)
        }), (function(e) {
            return e < .5 ? Math.pow(2 * e, c) / 2 : 1 - Math.pow(2 * (1 - e), c) / 2
        }))
    })), It.Linear.easeNone = It.none = It.Linear.easeIn, yb("Elastic", Ab("in"), Ab("out"), Ab()), G = 7.5625, X = 1 / 2.75, yb("Bounce", (function(e) {
        return 1 - sl(1 - e)
    }), sl), yb("Expo", (function(e) {
        return e ? Math.pow(2, 10 * (e - 1)) : 0
    })), yb("Circ", (function(e) {
        return -(rt(1 - e * e) - 1)
    })), yb("Sine", (function(e) {
        return 1 - it(e * et)
    })), yb("Back", Bb("in"), Bb("out"), Bb()), It.SteppedEase = It.steps = pt.SteppedEase = {
        config: function config(e, a) {
            void 0 === e && (e = 1);
            var c = 1 / e,
                d = e + (a ? 0 : 1),
                v = a ? 1 : 0;
            return function(e) {
                return ((d * Ot(0, .99999999, e) | 0) + v) * c
            }
        }
    }, W.ease = It["quad.out"];
    var jt, Vt = function GSCache(e, a) {
            this.id = nt++, (e._gsap = this).target = e, this.harness = a, this.get = a ? a.get : $, this.set = a ? a.getSetter : ne
        },
        Ut = ((jt = Animation.prototype).delay = function delay(e) {
            return e || 0 === e ? (this._delay = e, this) : this._delay
        }, jt.duration = function duration(e) {
            return arguments.length ? Ca(this, e) : this.totalDuration() && this._dur
        }, jt.totalDuration = function totalDuration(e) {
            return arguments.length ? (this._dirty = 0, Ca(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
        }, jt.totalTime = function totalTime(e, a) {
            if (Bt(), !arguments.length) return this._tTime;
            var c = this.parent || this._dp;
            if (c && c.smoothChildTiming && this._ts) {
                for (this._start = aa(c._time - (0 < this._ts ? e / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - e) / -this._ts)), xa(this), c._dirty || ra(c); c.parent;) c.parent._time !== c._start + (0 <= c._ts ? c._tTime / c._ts : (c.totalDuration() - c._tTime) / -c._ts) && c.totalTime(c._tTime, !0), c = c.parent;
                !this.parent && this._dp.autoRemoveChildren && ya(this._dp, this, this._start - this._delay)
            }
            return this._tTime === e && (this._dur || a) && Math.abs(this._zTime) !== J || (this._ts || (this._pTime = e), ea(this, e, a)), this
        }, jt.time = function time(e, a) {
            return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + ua(this)) % this._dur || (e ? this._dur : 0), a) : this._time
        }, jt.totalProgress = function totalProgress(e, a) {
            return arguments.length ? this.totalTime(this.totalDuration() * e, a) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio
        }, jt.progress = function progress(e, a) {
            return arguments.length ? this.totalTime(this.duration() * (!this._yoyo || 1 & this.iteration() ? e : 1 - e) + ua(this), a) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio
        }, jt.iteration = function iteration(e, a) {
            var c = this.duration() + this._rDelay;
            return arguments.length ? this.totalTime(this._time + (e - 1) * c, a) : this._repeat ? Mt(this._tTime, c) + 1 : 1
        }, jt.timeScale = function timeScale(e) {
            if (!arguments.length) return this._ts || this._pauseTS || 0;
            if (null !== this._pauseTS) return this._pauseTS = e, this;
            var a = this.parent && this._ts ? wa(this.parent._time, this) : this._tTime;
            return this._ts = e,
                function _recacheAncestors(e) {
                    for (var a = e.parent; a && a.parent;) a._dirty = 1, a.totalDuration(), a = a.parent;
                    return e
                }(this.totalTime(a, !0))
        }, jt.paused = function paused(e) {
            var a = !this._ts;
            return arguments.length ? (a !== e && (e ? (this._pauseTS = this._ts, this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Bt(), this._ts = this._pauseTS || 1, this._pauseTS = null, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, 1 === this.progress() && (this._tTime -= J) && Math.abs(this._zTime) !== J))), this) : a
        }, jt.startTime = function startTime(e) {
            return arguments.length ? (this.parent && this.parent._sort && ya(this.parent, this, e - this._delay), this) : this._start
        }, jt.endTime = function endTime(e) {
            return this._start + (s(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts)
        }, jt.rawTime = function rawTime(e) {
            var a = this.parent || this._dp;
            return a ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? wa(a.rawTime(e), this) : this._tTime : this._tTime
        }, jt.repeat = function repeat(e) {
            return arguments.length ? (this._repeat = e, Da(this)) : this._repeat
        }, jt.repeatDelay = function repeatDelay(e) {
            return arguments.length ? (this._rDelay = e, Da(this)) : this._rDelay
        }, jt.yoyo = function yoyo(e) {
            return arguments.length ? (this._yoyo = e, this) : this._yoyo
        }, jt.seek = function seek(e, a) {
            return this.totalTime(Fa(this, e), s(a))
        }, jt.restart = function restart(e, a) {
            return this.play().totalTime(e ? -this._delay : 0, s(a))
        }, jt.play = function play(e, a) {
            return null != e && this.seek(e, a), this.reversed(!1).paused(!1)
        }, jt.reverse = function reverse(e, a) {
            return null != e && this.seek(e || this.totalDuration(), a), this.reversed(!0).paused(!1)
        }, jt.pause = function pause(e, a) {
            return null != e && this.seek(e, a), this.paused(!0)
        }, jt.resume = function resume() {
            return this.paused(!1)
        }, jt.reversed = function reversed(e) {
            var a = this._ts || this._pauseTS || 0;
            return arguments.length ? (e !== this.reversed() && (this[null === this._pauseTS ? "_ts" : "_pauseTS"] = Math.abs(a) * (e ? -1 : 1), this.totalTime(this._tTime, !0)), this) : a < 0
        }, jt.invalidate = function invalidate() {
            return this._initted = 0, this._zTime = -J, this
        }, jt.isActive = function isActive(e) {
            var a, c = this.parent || this._dp,
                d = this._start;
            return !(c && !(this._ts && (this._initted || !e) && c.isActive(e) && (a = c.rawTime(!0)) >= d && a < this.endTime(!0) - J))
        }, jt.eventCallback = function eventCallback(e, a, c) {
            var d = this.vars;
            return 1 < arguments.length ? (a ? (d[e] = a, c && (d[e + "Params"] = c), "onUpdate" === e && (this._onUpdate = a)) : delete d[e], this) : d[e]
        }, jt.then = function then(e) {
            var a = this;
            return new Promise((function(c) {
                function Hm() {
                    var e = a.then;
                    a.then = null, o(d) && (d = d(a)) && (d.then || d === a) && (a.then = e), c(d), a.then = e
                }
                var d = o(e) ? e : ga;
                a._initted && 1 === a.totalProgress() && 0 <= a._ts || !a._tTime && a._ts < 0 ? Hm() : a._prom = Hm
            }))
        }, jt.kill = function kill() {
            cb(this)
        }, Animation);

    function Animation(e, c) {
        var d = e.parent || a;
        this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Ca(this, +e.duration, 1), this.data = e.data, C || Rt.wake(), d && ya(d, this, c || 0 === c ? c : d._time), e.reversed && this.reversed(!0), e.paused && this.paused(!0)
    }
    ha(Ut.prototype, {
        _time: 0,
        _start: 0,
        _end: 0,
        _tTime: 0,
        _tDur: 0,
        _dirty: 0,
        _repeat: 0,
        _yoyo: !1,
        parent: null,
        _initted: !1,
        _rDelay: 0,
        _ts: 1,
        _dp: 0,
        ratio: 0,
        _zTime: -J,
        _prom: 0,
        _pauseTS: null
    });
    var Gt = function(e) {
        function Timeline(a, c) {
            var d;
            return void 0 === a && (a = {}), (d = e.call(this, a, c) || this).labels = {}, d.smoothChildTiming = !!a.smoothChildTiming, d.autoRemoveChildren = !!a.autoRemoveChildren, d._sort = s(a.sortChildren), d
        }
        _inheritsLoose(Timeline, e);
        var c = Timeline.prototype;
        return c.to = function to(e, a, c, d) {
            return new Kt(e, ca(arguments, 0, this), Fa(this, p(a) ? d : c)), this
        }, c.from = function from(e, a, c, d) {
            return new Kt(e, ca(arguments, 1, this), Fa(this, p(a) ? d : c)), this
        }, c.fromTo = function fromTo(e, a, c, d, v) {
            return new Kt(e, ca(arguments, 2, this), Fa(this, p(a) ? v : d)), this
        }, c.set = function set(e, a, c) {
            return a.duration = 0, a.parent = this, a.repeatDelay || (a.repeat = 0), a.immediateRender = !!a.immediateRender, new Kt(e, a, Fa(this, c)), this
        }, c.call = function call(e, a, c) {
            return ya(this, Kt.delayedCall(0, e, a), Fa(this, c))
        }, c.staggerTo = function staggerTo(e, a, c, d, v, y, w) {
            return c.duration = a, c.stagger = c.stagger || d, c.onComplete = y, c.onCompleteParams = w, c.parent = this, new Kt(e, c, Fa(this, v)), this
        }, c.staggerFrom = function staggerFrom(e, a, c, d, v, y, w) {
            return c.runBackwards = 1, c.immediateRender = s(c.immediateRender), this.staggerTo(e, a, c, d, v, y, w)
        }, c.staggerFromTo = function staggerFromTo(e, a, c, d, v, y, w, b) {
            return d.startAt = c, d.immediateRender = s(d.immediateRender), this.staggerTo(e, a, d, v, y, w, b)
        }, c.render = function render(e, c, d) {
            var v, y, w, b, T, C, P, S, A, E, D, z, F = this._time,
                R = this._dirty ? this.totalDuration() : this._tDur,
                B = this._dur,
                I = this !== a && R - J < e && 0 <= e ? R : e < J ? 0 : e,
                V = this._zTime < 0 != e < 0 && (this._initted || !B);
            if (I !== this._tTime || d || V) {
                if (F !== this._time && B && (I += this._time - F, e += this._time - F), v = I, A = this._start, C = !(S = this._ts), V && (B || (F = this._zTime), !e && c || (this._zTime = e)), this._repeat && (D = this._yoyo, (B < (v = aa(I % (T = B + this._rDelay))) || R === I) && (v = B), (b = ~~(I / T)) && b === I / T && (v = B, b--), D && 1 & b && (v = B - v, z = 1), b !== (E = Mt(this._tTime, T)) && !this._lock)) {
                    var U = D && 1 & E,
                        G = U === (D && 1 & b);
                    if (b < E && (U = !U), F = U ? 0 : B, this._lock = 1, this.render(F, c, !B)._lock = 0, !c && this.parent && At(this, "onRepeat"), this.vars.repeatRefresh && !z && (this.invalidate()._lock = 1), F !== this._time || C != !this._ts) return this;
                    if (G && (this._lock = 2, F = U ? B + 1e-4 : -1e-4, this.render(F, !0), this.vars.repeatRefresh && !z && this.invalidate()), this._lock = 0, !this._ts && !C) return this
                }
                if (this._hasPause && !this._forcing && this._lock < 2 && (P = function _findNextPauseTween(e, a, c) {
                        var d;
                        if (a < c)
                            for (d = e._first; d && d._start <= c;) {
                                if (!d._dur && "isPause" === d.data && d._start > a) return d;
                                d = d._next
                            } else
                                for (d = e._last; d && d._start >= c;) {
                                    if (!d._dur && "isPause" === d.data && d._start < a) return d;
                                    d = d._prev
                                }
                    }(this, aa(F), aa(v))) && (I -= v - (v = P._start)), this._tTime = I, this._time = v, this._act = !S, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e), F || !v || c || At(this, "onStart"), F <= v && 0 <= e)
                    for (y = this._first; y;) {
                        if (w = y._next, (y._act || v >= y._start) && y._ts && P !== y) {
                            if (y.parent !== this) return this.render(e, c, d);
                            if (y.render(0 < y._ts ? (v - y._start) * y._ts : (y._dirty ? y.totalDuration() : y._tDur) + (v - y._start) * y._ts, c, d), v !== this._time || !this._ts && !C) {
                                P = 0, w && (I += this._zTime = -J);
                                break
                            }
                        }
                        y = w
                    } else {
                        y = this._last;
                        for (var X = e < 0 ? e : v; y;) {
                            if (w = y._prev, (y._act || X <= y._end) && y._ts && P !== y) {
                                if (y.parent !== this) return this.render(e, c, d);
                                if (y.render(0 < y._ts ? (X - y._start) * y._ts : (y._dirty ? y.totalDuration() : y._tDur) + (X - y._start) * y._ts, c, d), v !== this._time || !this._ts && !C) {
                                    P = 0, w && (I += this._zTime = X ? -J : J);
                                    break
                                }
                            }
                            y = w
                        }
                    }
                if (P && !c && (this.pause(), P.render(F <= v ? 0 : -J)._zTime = F <= v ? 1 : -1, this._ts)) return this._start = A, xa(this), this.render(e, c, d);
                this._onUpdate && !c && At(this, "onUpdate", !0), (I === R && R >= this.totalDuration() || !I && this._ts < 0) && (A !== this._start && Math.abs(S) === Math.abs(this._ts) || (!e && B || !(e && 0 < this._ts || !I && this._ts < 0) || qa(this, 1), c || e < 0 && !F || (At(this, I === R ? "onComplete" : "onReverseComplete", !0), this._prom && this._prom())))
            }
            return this
        }, c.add = function add(e, a) {
            var c = this;
            if (p(a) || (a = Fa(this, a)), !(e instanceof Ut)) {
                if (st(e)) return e.forEach((function(e) {
                    return c.add(e, a)
                })), ra(this);
                if (n(e)) return this.addLabel(e, a);
                if (!o(e)) return this;
                e = Kt.delayedCall(0, e)
            }
            return this !== e ? ya(this, e, a) : this
        }, c.getChildren = function getChildren(e, a, c, d) {
            void 0 === e && (e = !0), void 0 === a && (a = !0), void 0 === c && (c = !0), void 0 === d && (d = -H);
            for (var v = [], y = this._first; y;) y._start >= d && (y instanceof Kt ? a && v.push(y) : (c && v.push(y), e && v.push.apply(v, y.getChildren(!0, a, c)))), y = y._next;
            return v
        }, c.getById = function getById(e) {
            for (var a = this.getChildren(1, 1, 1), c = a.length; c--;)
                if (a[c].vars.id === e) return a[c]
        }, c.remove = function remove(e) {
            return n(e) ? this.removeLabel(e) : o(e) ? this.killTweensOf(e) : (pa(this, e), e === this._recent && (this._recent = this._last), ra(this))
        }, c.totalTime = function totalTime(a, c) {
            return arguments.length ? (this._forcing = 1, this.parent || this._dp || !this._ts || (this._start = aa(Rt.time - (0 < this._ts ? a / this._ts : (this.totalDuration() - a) / -this._ts))), e.prototype.totalTime.call(this, a, c), this._forcing = 0, this) : this._tTime
        }, c.addLabel = function addLabel(e, a) {
            return this.labels[e] = Fa(this, a), this
        }, c.removeLabel = function removeLabel(e) {
            return delete this.labels[e], this
        }, c.addPause = function addPause(e, a, c) {
            var d = Kt.delayedCall(0, a || O, c);
            return d.data = "isPause", this._hasPause = 1, ya(this, d, Fa(this, e))
        }, c.removePause = function removePause(e) {
            var a = this._first;
            for (e = Fa(this, e); a;) a._start === e && "isPause" === a.data && qa(a), a = a._next
        }, c.killTweensOf = function killTweensOf(e, a, c) {
            for (var d = this.getTweensOf(e, c), v = d.length; v--;) Xt !== d[v] && d[v].kill(e, a);
            return this
        }, c.getTweensOf = function getTweensOf(e, a) {
            for (var c, d = [], v = Pt(e), y = this._first; y;) y instanceof Kt ? !ba(y._targets, v) || a && !y.isActive("started" === a) || d.push(y) : (c = y.getTweensOf(v, a)).length && d.push.apply(d, c), y = y._next;
            return d
        }, c.tweenTo = function tweenTo(e, a) {
            a = a || {};
            var c = this,
                d = Fa(c, e),
                v = a.startAt,
                y = Kt.to(c, ha(a, {
                    ease: "none",
                    lazy: !1,
                    time: d,
                    duration: a.duration || Math.abs(d - (v && "time" in v ? v.time : c._time)) / c.timeScale() || J,
                    onStart: function onStart() {
                        c.pause();
                        var e = a.duration || Math.abs(d - c._time) / c.timeScale();
                        y._dur !== e && Ca(y, e).render(y._time, !0, !0), a.onStart && a.onStart.apply(y, a.onStartParams || [])
                    }
                }));
            return y
        }, c.tweenFromTo = function tweenFromTo(e, a, c) {
            return this.tweenTo(a, ha({
                startAt: {
                    time: Fa(this, e)
                }
            }, c))
        }, c.recent = function recent() {
            return this._recent
        }, c.nextLabel = function nextLabel(e) {
            return void 0 === e && (e = this._time), ab(this, Fa(this, e))
        }, c.previousLabel = function previousLabel(e) {
            return void 0 === e && (e = this._time), ab(this, Fa(this, e), 1)
        }, c.currentLabel = function currentLabel(e) {
            return arguments.length ? this.seek(e, !0) : this.previousLabel(this._time + J)
        }, c.shiftChildren = function shiftChildren(e, a, c) {
            void 0 === c && (c = 0);
            for (var d, v = this._first, y = this.labels; v;) v._start >= c && (v._start += e), v = v._next;
            if (a)
                for (d in y) y[d] >= c && (y[d] += e);
            return ra(this)
        }, c.invalidate = function invalidate() {
            var a = this._first;
            for (this._lock = 0; a;) a.invalidate(), a = a._next;
            return e.prototype.invalidate.call(this)
        }, c.clear = function clear(e) {
            void 0 === e && (e = !0);
            for (var a, c = this._first; c;) a = c._next, this.remove(c), c = a;
            return this._time = this._tTime = 0, e && (this.labels = {}), ra(this)
        }, c.totalDuration = function totalDuration(e) {
            var c, d, v, y, w = 0,
                b = this,
                T = b._last,
                C = H;
            if (arguments.length) return b._repeat < 0 ? b : b.timeScale(b.totalDuration() / e);
            if (b._dirty) {
                for (y = b.parent; T;) c = T._prev, T._dirty && T.totalDuration(), C < (v = T._start) && b._sort && T._ts && !b._lock ? (b._lock = 1, ya(b, T, v - T._delay)._lock = 0) : C = v, v < 0 && T._ts && (w -= v, (!y && !b._dp || y && y.smoothChildTiming) && (b._start += v / b._ts, b._time -= v, b._tTime -= v), b.shiftChildren(-v, !1, -1e20), C = 0), w < (d = xa(T)) && T._ts && (w = d), T = c;
                Ca(b, b === a && b._time > w ? b._time : Math.min(H, w), 1), b._dirty = 0
            }
            return b._tDur
        }, Timeline.updateRoot = function updateRoot(e) {
            if (a._ts && (ea(a, wa(e, a)), b = Rt.frame), Rt.frame >= wt) {
                wt += Q.autoSleep || 120;
                var c = a._first;
                if ((!c || !c._ts) && Q.autoSleep && Rt._listeners.length < 2) {
                    for (; c && !c._ts;) c = c._next;
                    c || Rt.sleep()
                }
            }
        }, Timeline
    }(Ut);

    function Ib(e, a, c, d, v, y) {
        var w, b, C, P;
        if (vt[e] && !1 !== (w = new vt[e]).init(v, w.rawVars ? a[e] : function _processVars(e, a, c, d, v) {
                if (o(e) && (e = Wt(e, v, a, c, d)), !r(e) || e.style && e.nodeType || st(e)) return n(e) ? Wt(e, v, a, c, d) : e;
                var y, w = {};
                for (y in e) w[y] = Wt(e[y], v, a, c, d);
                return w
            }(a[e], d, v, y, c), c, d, y) && (c._pt = b = new le(c._pt, v, e, 0, 1, w.render, w, 0, w.priority), c !== T))
            for (C = c._ptLookup[c._targets.indexOf(v)], P = w._props.length; P--;) C[w._props[P]] = b;
        return w
    }
    ha(Gt.prototype, {
        _lock: 0,
        _hasPause: 0,
        _forcing: 0
    });
    var Xt, Zt = function _addPropTween(e, a, c, d, v, y, w, b, T) {
            o(d) && (d = d(v || 0, e, y));
            var C, P = e[a],
                S = "get" !== c ? c : o(P) ? T ? e[a.indexOf("set") || !o(e["get" + a.substr(3)]) ? a : "get" + a.substr(3)](T) : e[a]() : P,
                A = o(P) ? T ? ee : te : Jt;
            if (n(d) && (~d.indexOf("random(") && (d = Za(d)), "=" === d.charAt(1) && (d = parseFloat(S) + parseFloat(d.substr(2)) * ("-" === d.charAt(0) ? -1 : 1) + (Ia(S) || 0))), S !== d) return isNaN(S + d) ? (P || a in e || L(a, d), function _addComplexStringPropTween(e, a, c, d, v, y, w) {
                var b, T, C, P, S, A, E, D, z = new le(this._pt, e, a, 0, 1, ae, null, v),
                    F = 0,
                    R = 0;
                for (z.b = c, z.e = d, c += "", (E = ~(d += "").indexOf("random(")) && (d = Za(d)), y && (y(D = [c, d], e, a), c = D[0], d = D[1]), T = c.match(lt) || []; b = lt.exec(d);) P = b[0], S = d.substring(F, b.index), C ? C = (C + 1) % 5 : "rgba(" === S.substr(-5) && (C = 1), P !== T[R++] && (A = parseFloat(T[R - 1]) || 0, z._pt = {
                    _next: z._pt,
                    p: S || 1 === R ? S : ",",
                    s: A,
                    c: "=" === P.charAt(1) ? parseFloat(P.substr(2)) * ("-" === P.charAt(0) ? -1 : 1) : parseFloat(P) - A,
                    m: C && C < 4 ? Math.round : 0
                }, F = lt.lastIndex);
                return z.c = F < d.length ? d.substring(F, d.length) : "", z.fp = w, (ct.test(d) || E) && (z.e = 0), this._pt = z
            }.call(this, e, a, S, d, A, b || Q.stringFilter, T)) : (C = new le(this._pt, e, a, +S || 0, d - (S || 0), "boolean" == typeof P ? ie : re, 0, A), T && (C.fp = T), w && C.modifier(w, this, e), this._pt = C)
        },
        Qt = function _initTween(e, c) {
            var d, v, y, w, b, T, C, P, S, A, E, D, z = e.vars,
                F = z.ease,
                R = z.startAt,
                B = z.immediateRender,
                I = z.lazy,
                V = z.onUpdate,
                U = z.onUpdateParams,
                G = z.callbackScope,
                X = z.runBackwards,
                Q = z.yoyoEase,
                H = z.keyframes,
                tt = z.autoRevert,
                et = e._dur,
                nt = e._startAt,
                rt = e._targets,
                it = e.parent,
                at = it && "nested" === it.data ? it.parent._targets : rt,
                st = "auto" === e._overwrite,
                ot = e.timeline;
            if (!ot || H && F || (F = "none"), e._ease = Yt(F, W.ease), e._yEase = Q ? Nt(Yt(!0 === Q ? F : Q, W.ease)) : 0, Q && e._yoyo && !e._repeat && (Q = e._yEase, e._yEase = e._ease, e._ease = Q), !ot) {
                if (nt && nt.render(-1, !0).kill(), R) {
                    if (qa(e._startAt = Kt.set(rt, ha({
                            data: "isStart",
                            overwrite: !1,
                            parent: it,
                            immediateRender: !0,
                            lazy: s(I),
                            startAt: null,
                            delay: 0,
                            onUpdate: V,
                            onUpdateParams: U,
                            callbackScope: G,
                            stagger: 0
                        }, R))), B)
                        if (0 < c) tt || (e._startAt = 0);
                        else if (et) return
                } else if (X && et)
                    if (nt) tt || (e._startAt = 0);
                    else if (c && (B = !1), qa(e._startAt = Kt.set(rt, Tt(la(z, _t), {
                        overwrite: !1,
                        data: "isFromStart",
                        lazy: B && s(I),
                        immediateRender: B,
                        stagger: 0,
                        parent: it
                    }))), B) {
                    if (!c) return
                } else _initTween(e._startAt, J);
                for (d = la(z, _t), D = (P = rt[e._pt = 0] ? Z(rt[0]).harness : 0) && z[P.prop], I = et && s(I) || I && !et, v = 0; v < rt.length; v++) {
                    if (C = (b = rt[v])._gsap || Y(rt)[v]._gsap, e._ptLookup[v] = A = {}, gt[C.id] && da(), E = at === rt ? v : at.indexOf(b), P && !1 !== (S = new P).init(b, D || d, e, E, at) && (e._pt = w = new le(e._pt, b, S.name, 0, 1, S.render, S, 0, S.priority), S._props.forEach((function(e) {
                            A[e] = w
                        })), S.priority && (T = 1)), !P || D)
                        for (y in d) vt[y] && (S = Ib(y, d, e, E, b, at)) ? S.priority && (T = 1) : A[y] = w = Zt.call(e, b, y, "get", d[y], E, at, 0, z.stringFilter);
                    e._op && e._op[v] && e.kill(b, e._op[v]), st && e._pt && (Xt = e, a.killTweensOf(b, A, "started"), Xt = 0), e._pt && I && (gt[C.id] = 1)
                }
                T && he(e), e._onInit && e._onInit(e)
            }
            e._from = !ot && !!z.runBackwards, e._onUpdate = V, e._initted = 1
        },
        Wt = function _parseFuncOrString(e, a, c, d, v) {
            return o(e) ? e.call(a, c, d, v) : n(e) && ~e.indexOf("random(") ? Za(e) : e
        },
        Ht = xt + ",repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
        $t = (Ht + ",id,stagger,delay,duration,paused").split(","),
        Kt = function(e) {
            function Tween(c, d, v) {
                var y;
                "number" == typeof d && (v.duration = d, d = v, v = null);
                var w, b, T, C, P, S, A, E, D = (y = e.call(this, function _inheritDefaults(e) {
                        var c = e.parent || a,
                            d = e.keyframes ? ia : ha;
                        if (s(e.inherit))
                            for (; c;) d(e, c.vars.defaults), c = c.parent;
                        return e
                    }(d), v) || this).vars,
                    z = D.duration,
                    F = D.delay,
                    R = D.immediateRender,
                    B = D.stagger,
                    I = D.overwrite,
                    V = D.keyframes,
                    U = D.defaults,
                    G = (st(c) ? p(c[0]) : "length" in d) ? [c] : Pt(c);
                if (y._targets = G.length ? Y(G) : M("GSAP target " + c + " not found. https://greensock.com", !Q.nullTargetWarn) || [], y._ptLookup = [], y._overwrite = I, V || B || u(z) || u(F)) {
                    if (d = y.vars, (w = y.timeline = new Gt({
                            data: "nested",
                            defaults: U || {}
                        })).kill(), w.parent = _assertThisInitialized(y), V) ha(w.vars.defaults, {
                        ease: "none"
                    }), V.forEach((function(e) {
                        return w.to(G, e, ">")
                    }));
                    else {
                        if (C = G.length, A = B ? Pa(B) : O, r(B))
                            for (P in B) ~Ht.indexOf(P) && ((E = E || {})[P] = B[P]);
                        for (b = 0; b < C; b++) {
                            for (P in T = {}, d) $t.indexOf(P) < 0 && (T[P] = d[P]);
                            T.stagger = 0, E && Tt(T, E), d.yoyoEase && !d.repeat && (T.yoyoEase = d.yoyoEase), S = G[b], T.duration = +Wt(z, _assertThisInitialized(y), b, S, G), T.delay = (+Wt(F, _assertThisInitialized(y), b, S, G) || 0) - y._delay, !B && 1 === C && T.delay && (y._delay = F = T.delay, y._start += F, T.delay = 0), w.to(S, T, A(b, S, G))
                        }
                        z = F = 0
                    }
                    z || y.duration(z = w.duration())
                } else y.timeline = 0;
                return !0 === I && (Xt = _assertThisInitialized(y), a.killTweensOf(G), Xt = 0), (R || !z && !V && y._start === y.parent._time && s(R) && function _hasNoPausedAncestors(e) {
                    return !e || e._ts && _hasNoPausedAncestors(e.parent)
                }(_assertThisInitialized(y)) && "nested" !== y.parent.data) && (y._tTime = -J, y.render(Math.max(0, -F))), y
            }
            _inheritsLoose(Tween, e);
            var c = Tween.prototype;
            return c.render = function render(e, a, c) {
                var d, v, y, w, b, T, C, P, S, A = this._time,
                    E = this._tDur,
                    D = this._dur,
                    z = E - J < e && 0 <= e ? E : e < J ? 0 : e;
                if (D) {
                    if (z !== this._tTime || !e || c || this._startAt && this._zTime < 0 != e < 0) {
                        if (d = z, P = this.timeline, this._repeat) {
                            if ((D < (d = aa(z % (w = D + this._rDelay))) || E === z) && (d = D), (y = ~~(z / w)) && y === z / w && (d = D, y--), (T = this._yoyo && 1 & y) && (S = this._yEase, d = D - d), b = Mt(this._tTime, w), d === A && !c && this._initted) return this;
                            y !== b && (!this.vars.repeatRefresh || T || this._lock || (this._lock = c = 1, this.render(w * y, !0).invalidate()._lock = 0))
                        }
                        if (!this._initted && za(this, d, c, a)) return this._tTime = 0, this;
                        for (this._tTime = z, this._time = d, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = C = (S || this._ease)(d / D), this._from && (this.ratio = C = 1 - C), A || !d || a || At(this, "onStart"), v = this._pt; v;) v.r(C, v.d), v = v._next;
                        P && P.render(e < 0 ? e : !d && T ? -J : P._dur * C, a, c) || this._startAt && (this._zTime = e), this._onUpdate && !a && (e < 0 && this._startAt && this._startAt.render(e, !0, c), At(this, "onUpdate")), this._repeat && y !== b && this.vars.onRepeat && !a && this.parent && At(this, "onRepeat"), z !== this._tDur && z || this._tTime !== z || (e < 0 && this._startAt && !this._onUpdate && this._startAt.render(e, !0, c), !e && D || !(e && 0 < this._ts || !z && this._ts < 0) || qa(this, 1), a || e < 0 && !A || (At(this, z === E ? "onComplete" : "onReverseComplete", !0), this._prom && this._prom()))
                    }
                } else ! function _renderZeroDurationTween(e, a, c, d) {
                    var v, y = e._zTime < 0 ? 0 : 1,
                        w = a < 0 ? 0 : 1,
                        b = e._rDelay,
                        T = 0;
                    if (b && e._repeat && (T = Ot(0, e._tDur, a), Mt(T, b) !== Mt(e._tTime, b) && (y = 1 - w, e.vars.repeatRefresh && e._initted && e.invalidate())), (e._initted || !za(e, a, d, c)) && (w !== y || d || e._zTime === J || !a && e._zTime)) {
                        for (e._zTime = a || (c ? J : 0), e.ratio = w, e._from && (w = 1 - w), e._time = 0, e._tTime = T, c || At(e, "onStart"), v = e._pt; v;) v.r(w, v.d), v = v._next;
                        !w && e._startAt && !e._onUpdate && e._start && e._startAt.render(a, !0, d), e._onUpdate && !c && At(e, "onUpdate"), T && e._repeat && !c && e.parent && At(e, "onRepeat"), (a >= e._tDur || a < 0) && e.ratio === w && (e.ratio && qa(e, 1), c || (At(e, e.ratio ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()))
                    }
                }(this, e, a, c);
                return this
            }, c.targets = function targets() {
                return this._targets
            }, c.invalidate = function invalidate() {
                return this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(), e.prototype.invalidate.call(this)
            }, c.kill = function kill(e, a) {
                if (void 0 === a && (a = "all"), !(e || a && "all" !== a) && (this._lazy = 0, this.parent)) return cb(this);
                if (this.timeline) return this.timeline.killTweensOf(e, a, Xt && !0 !== Xt.vars.overwrite), this;
                var c, d, v, y, w, b, T, C = this._targets,
                    P = e ? Pt(e) : C,
                    S = this._ptLookup,
                    A = this._pt;
                if ((!a || "all" === a) && function _arraysMatch(e, a) {
                        for (var c = e.length, d = c === a.length; d && c-- && e[c] === a[c];);
                        return c < 0
                    }(C, P)) return cb(this);
                for (c = this._op = this._op || [], "all" !== a && (n(a) && (w = {}, _(a, (function(e) {
                        return w[e] = 1
                    })), a = w), a = function _addAliasesToVars(e, a) {
                        var c, d, v, y, w = e[0] ? Z(e[0]).harness : 0,
                            b = w && w.aliases;
                        if (!b) return a;
                        for (d in c = Tt({}, a), b)
                            if (d in c)
                                for (v = (y = b[d].split(",")).length; v--;) c[y[v]] = c[d];
                        return c
                    }(C, a)), T = C.length; T--;)
                    if (~P.indexOf(C[T]))
                        for (w in d = S[T], "all" === a ? (c[T] = a, y = d, v = {}) : (v = c[T] = c[T] || {}, y = a), y)(b = d && d[w]) && ("kill" in b.d && !0 !== b.d.kill(w) || pa(this, b, "_pt"), delete d[w]), "all" !== v && (v[w] = 1);
                return this._initted && !this._pt && A && cb(this), this
            }, Tween.to = function to(e, a, c) {
                return new Tween(e, a, c)
            }, Tween.from = function from(e, a) {
                return new Tween(e, ca(arguments, 1))
            }, Tween.delayedCall = function delayedCall(e, a, c, d) {
                return new Tween(a, 0, {
                    immediateRender: !1,
                    lazy: !1,
                    overwrite: !1,
                    delay: e,
                    onComplete: a,
                    onReverseComplete: a,
                    onCompleteParams: c,
                    onReverseCompleteParams: c,
                    callbackScope: d
                })
            }, Tween.fromTo = function fromTo(e, a, c) {
                return new Tween(e, ca(arguments, 2))
            }, Tween.set = function set(e, a) {
                return a.duration = 0, a.repeatDelay || (a.repeat = 0), new Tween(e, a)
            }, Tween.killTweensOf = function killTweensOf(e, c, d) {
                return a.killTweensOf(e, c, d)
            }, Tween
        }(Ut);

    function Tb(e, a, c) {
        return e.setAttribute(a, c)
    }

    function _b(e, a, c, d) {
        d.mSet(e, a, d.m.call(d.tween, c, d.mt), d)
    }
    ha(Kt.prototype, {
        _targets: [],
        _lazy: 0,
        _startAt: 0,
        _op: 0,
        _onInit: 0
    }), _("staggerTo,staggerFrom,staggerFromTo", (function(e) {
        Kt[e] = function() {
            var a = new Gt,
                c = Ct.call(arguments, 0);
            return c.splice("staggerFromTo" === e ? 5 : 4, 0, 0), a[e].apply(a, c)
        }
    }));
    var Jt = function _setterPlain(e, a, c) {
            return e[a] = c
        },
        te = function _setterFunc(e, a, c) {
            return e[a](c)
        },
        ee = function _setterFuncWithParam(e, a, c, d) {
            return e[a](d.fp, c)
        },
        ne = function _getSetter(e, a) {
            return o(e[a]) ? te : q(e[a]) && e.setAttribute ? Tb : Jt
        },
        re = function _renderPlain(e, a) {
            return a.set(a.t, a.p, Math.round(1e4 * (a.s + a.c * e)) / 1e4, a)
        },
        ie = function _renderBoolean(e, a) {
            return a.set(a.t, a.p, !!(a.s + a.c * e), a)
        },
        ae = function _renderComplexString(e, a) {
            var c = a._pt,
                d = "";
            if (!e && a.b) d = a.b;
            else if (1 === e && a.e) d = a.e;
            else {
                for (; c;) d = c.p + (c.m ? c.m(c.s + c.c * e) : Math.round(1e4 * (c.s + c.c * e)) / 1e4) + d, c = c._next;
                d += a.c
            }
            a.set(a.t, a.p, d, a)
        },
        se = function _renderPropTweens(e, a) {
            for (var c = a._pt; c;) c.r(e, c.d), c = c._next
        },
        oe = function _addPluginModifier(e, a, c, d) {
            for (var v, y = this._pt; y;) v = y._next, y.p === d && y.modifier(e, a, c), y = v
        },
        ue = function _killPropTweensOf(e) {
            for (var a, c, d = this._pt; d;) c = d._next, d.p === e && !d.op || d.op === e ? pa(this, d, "_pt") : d.dep || (a = 1), d = c;
            return !a
        },
        he = function _sortPropTweensByPriority(e) {
            for (var a, c, d, v, y = e._pt; y;) {
                for (a = y._next, c = d; c && c.pr > y.pr;) c = c._next;
                (y._prev = c ? c._prev : v) ? y._prev._next = y: d = y, (y._next = c) ? c._prev = y : v = y, y = a
            }
            e._pt = d
        },
        le = (PropTween.prototype.modifier = function modifier(e, a, c) {
            this.mSet = this.mSet || this.set, this.set = _b, this.m = e, this.mt = c, this.tween = a
        }, PropTween);

    function PropTween(e, a, c, d, v, y, w, b, T) {
        this.t = a, this.s = d, this.c = v, this.p = c, this.r = y || re, this.d = w || this, this.set = b || Jt, this.pr = T || 0, (this._next = e) && (e._prev = this)
    }
    _(xt + ",parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert", (function(e) {
        _t[e] = 1, "on" === e.substr(0, 2) && (_t[e + "Params"] = 1)
    })), pt.TweenMax = pt.TweenLite = Kt, pt.TimelineLite = pt.TimelineMax = Gt, a = new Gt({
        sortChildren: !1,
        defaults: W,
        autoRemoveChildren: !0,
        id: "root",
        smoothChildTiming: !0
    }), Q.stringFilter = nb;
    var fe = {
        registerPlugin: function registerPlugin() {
            for (var e = arguments.length, a = new Array(e), c = 0; c < e; c++) a[c] = arguments[c];
            a.forEach((function(e) {
                return function _createPlugin(e) {
                    var a = (e = !e.name && e.default || e).name,
                        c = o(e),
                        d = a && !c && e.init ? function() {
                            this._props = []
                        } : e,
                        v = {
                            init: O,
                            render: se,
                            add: Zt,
                            kill: ue,
                            modifier: oe,
                            rawVars: 0
                        },
                        y = {
                            targetTest: 0,
                            get: 0,
                            getSetter: ne,
                            aliases: {},
                            register: 0
                        };
                    if (Bt(), e !== d) {
                        if (vt[a]) return;
                        ha(d, ha(la(e, v), y)), Tt(d.prototype, Tt(v, la(e, y))), vt[d.prop = a] = d, e.targetTest && (bt.push(d), _t[a] = 1), a = ("css" === a ? "CSS" : a.charAt(0).toUpperCase() + a.substr(1)) + "Plugin"
                    }
                    N(a, d), e.register && e.register(ce, d, le)
                }(e)
            }))
        },
        timeline: function timeline(e) {
            return new Gt(e)
        },
        getTweensOf: function getTweensOf(e, c) {
            return a.getTweensOf(e, c)
        },
        getProperty: function getProperty(e, a, c, d) {
            n(e) && (e = Pt(e)[0]);
            var v = Z(e || {}).get,
                y = c ? ga : fa;
            return "native" === c && (c = ""), e ? a ? y((vt[a] && vt[a].get || v)(e, a, c, d)) : function(a, c, d) {
                return y((vt[a] && vt[a].get || v)(e, a, c, d))
            } : e
        },
        quickSetter: function quickSetter(e, a, c) {
            if (1 < (e = Pt(e)).length) {
                var d = e.map((function(e) {
                        return ce.quickSetter(e, a, c)
                    })),
                    v = d.length;
                return function(e) {
                    for (var a = v; a--;) d[a](e)
                }
            }
            e = e[0] || {};
            var y = vt[a],
                w = Z(e),
                b = y ? function(a) {
                    var d = new y;
                    T._pt = 0, d.init(e, c ? a + c : a, T, 0, [e]), d.render(1, d), T._pt && se(1, T)
                } : w.set(e, a);
            return y ? b : function(d) {
                return b(e, a, c ? d + c : d, w, 1)
            }
        },
        isTweening: function isTweening(e) {
            return 0 < a.getTweensOf(e, !0).length
        },
        defaults: function defaults(e) {
            return e && e.ease && (e.ease = Yt(e.ease, W.ease)), ka(W, e || {})
        },
        config: function config(e) {
            return ka(Q, e || {})
        },
        registerEffect: function registerEffect(e) {
            var a = e.name,
                c = e.effect,
                d = e.plugins,
                v = e.defaults,
                y = e.extendTimeline;
            (d || "").split(",").forEach((function(e) {
                return e && !vt[e] && !pt[e] && M(a + " effect requires " + e + " plugin.")
            })), yt[a] = function(e, a) {
                return c(Pt(e), ha(a || {}, v))
            }, y && (Gt.prototype[a] = function(e, c, d) {
                return this.add(yt[a](e, r(c) ? c : (d = c) && {}), d)
            })
        },
        registerEase: function registerEase(e, a) {
            It[e] = Yt(a)
        },
        parseEase: function parseEase(e, a) {
            return arguments.length ? Yt(e, a) : It
        },
        getById: function getById(e) {
            return a.getById(e)
        },
        exportRoot: function exportRoot(e, c) {
            void 0 === e && (e = {});
            var d, v, y = new Gt(e);
            for (y.smoothChildTiming = s(e.smoothChildTiming), a.remove(y), y._dp = 0, y._time = y._tTime = a._time, d = a._first; d;) v = d._next, !c && !d._dur && d instanceof Kt && d.vars.onComplete === d._targets[0] || ya(y, d, d._start - d._delay), d = v;
            return ya(a, y, 0), y
        },
        utils: {
            wrap: function wrap(e, a, c) {
                var d = a - e;
                return st(e) ? Wa(e, wrap(0, e.length), a) : Ga(c, (function(a) {
                    return (d + (a - e) % d) % d + e
                }))
            },
            wrapYoyo: function wrapYoyo(e, a, c) {
                var d = a - e,
                    v = 2 * d;
                return st(e) ? Wa(e, wrapYoyo(0, e.length - 1), a) : Ga(c, (function(a) {
                    return e + (d < (a = (v + (a - e) % v) % v) ? v - a : a)
                }))
            },
            distribute: Pa,
            random: Sa,
            snap: Ra,
            normalize: function normalize(e, a, c) {
                return St(e, a, 0, 1, c)
            },
            getUnit: Ia,
            clamp: function clamp(e, a, c) {
                return Ga(c, (function(c) {
                    return Ot(e, a, c)
                }))
            },
            splitColor: ib,
            toArray: Pt,
            mapRange: St,
            pipe: function pipe() {
                for (var e = arguments.length, a = new Array(e), c = 0; c < e; c++) a[c] = arguments[c];
                return function(e) {
                    return a.reduce((function(e, a) {
                        return a(e)
                    }), e)
                }
            },
            unitize: function unitize(e, a) {
                return function(c) {
                    return e(parseFloat(c)) + (a || Ia(c))
                }
            },
            interpolate: function interpolate(e, a, c, d) {
                var v = isNaN(e + a) ? 0 : function(c) {
                    return (1 - c) * e + c * a
                };
                if (!v) {
                    var y, w, b, T, C, P = n(e),
                        S = {};
                    if (!0 === c && (d = 1) && (c = null), P) e = {
                        p: e
                    }, a = {
                        p: a
                    };
                    else if (st(e) && !st(a)) {
                        for (b = [], T = e.length, C = T - 2, w = 1; w < T; w++) b.push(interpolate(e[w - 1], e[w]));
                        T--, v = function func(e) {
                            e *= T;
                            var a = Math.min(C, ~~e);
                            return b[a](e - a)
                        }, c = a
                    } else d || (e = Tt(st(e) ? [] : {}, e));
                    if (!b) {
                        for (y in a) Zt.call(S, e, y, "get", a[y]);
                        v = function func(a) {
                            return se(a, S) || (P ? e.p : e)
                        }
                    }
                }
                return Ga(c, v)
            },
            shuffle: Oa
        },
        install: K,
        effects: yt,
        ticker: Rt,
        updateRoot: Gt.updateRoot,
        plugins: vt,
        globalTimeline: a,
        core: {
            PropTween: le,
            globals: N,
            Tween: Kt,
            Timeline: Gt,
            Animation: Ut,
            getCache: Z
        }
    };

    function dc(e, a) {
        for (var c = e._pt; c && c.p !== a && c.op !== a && c.fp !== a;) c = c._next;
        return c
    }

    function fc(e, a) {
        return {
            name: e,
            rawVars: 1,
            init: function init(e, c, d) {
                d._onInit = function(e) {
                    var d, v;
                    if (n(c) && (d = {}, _(c, (function(e) {
                            return d[e] = 1
                        })), c = d), a) {
                        for (v in d = {}, c) d[v] = a(c[v]);
                        c = d
                    }! function _addModifiers(e, a) {
                        var c, d, v, y = e._targets;
                        for (c in a)
                            for (d = y.length; d--;)(v = (v = e._ptLookup[d][c]) && v.d) && (v._pt && (v = dc(v, c)), v && v.modifier && v.modifier(a[c], e, y[d], c))
                    }(e, c)
                }
            }
        }
    }
    _("to,from,fromTo,delayedCall,set,killTweensOf", (function(e) {
        return fe[e] = Kt[e]
    })), Rt.add(Gt.updateRoot), T = fe.to({}, {
        duration: 0
    });
    var ce = fe.registerPlugin({
        name: "attr",
        init: function init(e, a, c, d, v) {
            for (var y in a) this.add(e, "setAttribute", (e.getAttribute(y) || 0) + "", a[y], d, v, 0, 0, y), this._props.push(y)
        }
    }, {
        name: "endArray",
        init: function init(e, a) {
            for (var c = a.length; c--;) this.add(e, c, e[c] || 0, a[c])
        }
    }, fc("roundProps", Qa), fc("modifiers"), fc("snap", Ra)) || fe;

    function Qc(e, a) {
        return a.set(a.t, a.p, Math.round(1e4 * (a.s + a.c * e)) / 1e4 + a.u, a)
    }

    function Rc(e, a) {
        return a.set(a.t, a.p, 1 === e ? a.e : Math.round(1e4 * (a.s + a.c * e)) / 1e4 + a.u, a)
    }

    function Sc(e, a) {
        return a.set(a.t, a.p, e ? Math.round(1e4 * (a.s + a.c * e)) / 1e4 + a.u : a.b, a)
    }

    function Tc(e, a) {
        var c = a.s + a.c * e;
        a.set(a.t, a.p, ~~(c + (c < 0 ? -.5 : .5)) + a.u, a)
    }

    function Uc(e, a) {
        return a.set(a.t, a.p, e ? a.e : a.b, a)
    }

    function Vc(e, a) {
        return a.set(a.t, a.p, 1 !== e ? a.b : a.e, a)
    }

    function Wc(e, a, c) {
        return e.style[a] = c
    }

    function Xc(e, a, c) {
        return e.style.setProperty(a, c)
    }

    function Yc(e, a, c) {
        return e._gsap[a] = c
    }

    function Zc(e, a, c) {
        return e._gsap.scaleX = e._gsap.scaleY = c
    }

    function $c(e, a, c, d, v) {
        var y = e._gsap;
        y.scaleX = y.scaleY = c, y.renderTransform(v, y)
    }

    function _c(e, a, c, d, v) {
        var y = e._gsap;
        y[a] = c, y.renderTransform(v, y)
    }

    function dd(e, a) {
        var c = pe.createElementNS ? pe.createElementNS((a || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : pe.createElement(e);
        return c.style ? c : pe.createElement(e)
    }

    function ed(e, a, c) {
        var d = getComputedStyle(e);
        return d[a] || d.getPropertyValue(a.replace(Ve, "-$1").toLowerCase()) || d.getPropertyValue(a) || !c && ed(e, He(a) || a, 1) || ""
    }

    function hd() {
        ! function _windowExists() {
            return "undefined" != typeof window
        }() || (de = window, pe = de.document, _e = pe.documentElement, ge = dd("div") || {
            style: {}
        }, ve = dd("div"), Ze = He(Ze), Qe = He(Qe), ge.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", we = !!He("perspective"), me = 1)
    }

    function jd(e, a) {
        for (var c = a.length; c--;)
            if (e.hasAttribute(a[c])) return e.getAttribute(a[c])
    }

    function kd(e) {
        var a;
        try {
            a = e.getBBox()
        } catch (c) {
            a = function _getBBoxHack(e) {
                var a, c = dd("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                    d = this.parentNode,
                    v = this.nextSibling,
                    y = this.style.cssText;
                if (_e.appendChild(c), c.appendChild(this), this.style.display = "block", e) try {
                    a = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = _getBBoxHack
                } catch (e) {} else this._gsapBBox && (a = this._gsapBBox());
                return v ? d.insertBefore(this, v) : d.appendChild(this), _e.removeChild(c), this.style.cssText = y, a
            }.call(e, !0)
        }
        return !a || a.width || a.x || a.y ? a : {
            x: +jd(e, ["x", "cx", "x1"]) || 0,
            y: +jd(e, ["y", "cy", "y1"]) || 0,
            width: 0,
            height: 0
        }
    }

    function ld(e) {
        return !(!e.getCTM || e.parentNode && !e.ownerSVGElement || !kd(e))
    }

    function md(e, a) {
        if (a) {
            var c = e.style;
            a in qe && (a = Ze), c.removeProperty ? ("ms" !== a.substr(0, 2) && "webkit" !== a.substr(0, 6) || (a = "-" + a), c.removeProperty(a.replace(Ve, "-$1").toLowerCase())) : c.removeAttribute(a)
        }
    }

    function nd(e, a, c, d, v, y) {
        var w = new le(e._pt, a, c, 0, 1, y ? Vc : Uc);
        return (e._pt = w).b = d, w.e = v, e._props.push(c), w
    }

    function pd(e, a, c, d) {
        var v, y, w, b, T = parseFloat(c) || 0,
            C = (c + "").trim().substr((T + "").length) || "px",
            P = ge.style,
            S = Ue.test(a),
            A = "svg" === e.tagName.toLowerCase(),
            E = (A ? "client" : "offset") + (S ? "Width" : "Height"),
            D = "px" === d;
        return d === C || !T || $e[d] || $e[C] ? T : (b = e.getCTM && ld(e), "%" === d && (qe[a] || ~a.indexOf("adius")) ? aa(T / (b ? e.getBBox()[S ? "width" : "height"] : e[E]) * 100) : (P[S ? "width" : "height"] = 100 + (D ? C : d), y = ~a.indexOf("adius") || "em" === d && e.appendChild && !A ? e : e.parentNode, b && (y = (e.ownerSVGElement || {}).parentNode), y && y !== pe && y.appendChild || (y = pe.body), (w = y._gsap) && "%" === d && w.width && S && w.time === Rt.time ? aa(T / w.width * 100) : (y === e && (P.position = "static"), y.appendChild(ge), v = ge[E], y.removeChild(ge), P.position = "absolute", S && "%" === d && ((w = Z(y)).time = Rt.time, w.width = y[E]), aa(D ? v * T / 100 : 100 / v * T))))
    }

    function qd(e, a, c, d) {
        var v;
        return me || hd(), a in Xe && "transform" !== a && ~(a = Xe[a]).indexOf(",") && (a = a.split(",")[0]), qe[a] && "transform" !== a ? (v = nn(e, d), v = "transformOrigin" !== a ? v[a] : rn(ed(e, Qe)) + " " + v.zOrigin + "px") : (v = e.style[a]) && "auto" !== v && !d && !~(v + "").indexOf("calc(") || (v = Je[a] && Je[a](e, a, c) || ed(e, a) || $(e, a) || ("opacity" === a ? 1 : 0)), c && !~(v + "").indexOf(" ") ? pd(e, a, v, c) + c : v
    }

    function rd(e, a, c, d) {
        if (!c || "none" === c) {
            var v = He(a, e, 1),
                y = v && ed(e, v, 1);
            y && y !== c && (a = v, c = y)
        }
        var w, b, T, C, P, S, A, E, D, z, F, R, B = new le(this._pt, e.style, a, 0, 1, ae),
            I = 0,
            V = 0;
        if (B.b = c, B.e = d, c += "", "auto" == (d += "") && (e.style[a] = d, d = ed(e, a) || d, e.style[a] = c), nb(w = [c, d]), d = w[1], T = (c = w[0]).match(ht) || [], (d.match(ht) || []).length) {
            for (; b = ht.exec(d);) A = b[0], D = d.substring(I, b.index), P ? P = (P + 1) % 5 : "rgba(" !== D.substr(-5) && "hsla(" !== D.substr(-5) || (P = 1), A !== (S = T[V++] || "") && (C = parseFloat(S) || 0, F = S.substr((C + "").length), (R = "=" === A.charAt(1) ? +(A.charAt(0) + "1") : 0) && (A = A.substr(2)), E = parseFloat(A), z = A.substr((E + "").length), I = ht.lastIndex - z.length, z || (z = z || Q.units[a] || F, I === d.length && (d += z, B.e += z)), F !== z && (C = pd(e, a, S, z) || 0), B._pt = {
                _next: B._pt,
                p: D || 1 === V ? D : ",",
                s: C,
                c: R ? R * E : E - C,
                m: P && P < 4 ? Math.round : 0
            });
            B.c = I < d.length ? d.substring(I, d.length) : ""
        } else B.r = "display" === a && "none" === d ? Vc : Uc;
        return ct.test(d) && (B.e = 0), this._pt = B
    }

    function td(e) {
        var a = e.split(" "),
            c = a[0],
            d = a[1] || "50%";
        return "top" !== c && "bottom" !== c && "left" !== d && "right" !== d || (e = c, c = d, d = e), a[0] = Ke[c] || c, a[1] = Ke[d] || d, a.join(" ")
    }

    function ud(e, a) {
        if (a.tween && a.tween._time === a.tween._dur) {
            var c, d, v, y = a.t,
                w = y.style,
                b = a.u;
            if ("all" === b || !0 === b) w.cssText = "", d = 1;
            else
                for (v = (b = b.split(",")).length; - 1 < --v;) c = b[v], qe[c] && (d = 1, c = "transformOrigin" === c ? Qe : Ze), md(y, c);
            d && (md(y, Ze), (d = y._gsap) && (d.svg && y.removeAttribute("transform"), nn(y, 1)))
        }
    }

    function yd(e) {
        return "matrix(1, 0, 0, 1, 0, 0)" === e || "none" === e || !e
    }

    function zd(e) {
        var a = ed(e, Ze);
        return yd(a) ? tn : a.substr(7).match(ut).map(aa)
    }

    function Ad(e, a) {
        var c, d, v, y, w = e._gsap,
            b = e.style,
            T = zd(e);
        return w.svg && e.getAttribute("transform") ? "1,0,0,1,0,0" === (T = [(v = e.transform.baseVal.consolidate().matrix).a, v.b, v.c, v.d, v.e, v.f]).join(",") ? tn : T : (T !== tn || e.offsetParent || e === _e || w.svg || (v = b.display, b.display = "block", (c = e.parentNode) && e.offsetParent || (y = 1, d = e.nextSibling, _e.appendChild(e)), T = zd(e), v ? b.display = v : md(e, "display"), y && (d ? c.insertBefore(e, d) : c ? c.appendChild(e) : _e.removeChild(e))), a && 6 < T.length ? [T[0], T[1], T[4], T[5], T[12], T[13]] : T)
    }

    function Bd(e, a, c, d, v, y) {
        var w, b, T, C = e._gsap,
            P = v || Ad(e, !0),
            S = C.xOrigin || 0,
            A = C.yOrigin || 0,
            E = C.xOffset || 0,
            D = C.yOffset || 0,
            z = P[0],
            F = P[1],
            R = P[2],
            B = P[3],
            I = P[4],
            V = P[5],
            U = a.split(" "),
            G = parseFloat(U[0]) || 0,
            X = parseFloat(U[1]) || 0;
        c ? P !== tn && (b = z * B - F * R) && (T = G * (-F / b) + X * (z / b) - (z * V - F * I) / b, G = G * (B / b) + X * (-R / b) + (R * V - B * I) / b, X = T) : (G = (w = kd(e)).x + (~U[0].indexOf("%") ? G / 100 * w.width : G), X = w.y + (~(U[1] || U[0]).indexOf("%") ? X / 100 * w.height : X)), d || !1 !== d && C.smooth ? (I = G - S, V = X - A, C.xOffset = E + (I * z + V * R) - I, C.yOffset = D + (I * F + V * B) - V) : C.xOffset = C.yOffset = 0, C.xOrigin = G, C.yOrigin = X, C.smooth = !!d, C.origin = a, C.originIsAbsolute = !!c, e.style[Qe] = "0px 0px", y && (nd(y, C, "xOrigin", S, G), nd(y, C, "yOrigin", A, X), nd(y, C, "xOffset", E, C.xOffset), nd(y, C, "yOffset", D, C.yOffset))
    }

    function Ed(e, a, c) {
        var d = Ia(a);
        return aa(parseFloat(a) + parseFloat(pd(e, "x", c + "px", d))) + d
    }

    function Ld(e, a, c, d, v, y) {
        var w, b, T = 360,
            C = n(v),
            P = parseFloat(v) * (C && ~v.indexOf("rad") ? Ne : 1),
            S = y ? P * y : P - d,
            A = d + S + "deg";
        return C && ("short" === (w = v.split("_")[1]) && (S %= T) != S % 180 && (S += S < 0 ? T : -T), "cw" === w && S < 0 ? S = (S + 36e9) % T - ~~(S / T) * T : "ccw" === w && 0 < S && (S = (S - 36e9) % T - ~~(S / T) * T)), e._pt = b = new le(e._pt, a, c, d, S, Rc), b.e = A, b.u = "deg", e._props.push(c), b
    }

    function Md(e, a, c) {
        var d, v, y, w, b, T, C, P = ve.style,
            S = c._gsap;
        for (v in P.cssText = getComputedStyle(c).cssText + ";position:absolute;display:block;", P[Ze] = a, pe.body.appendChild(ve), d = nn(ve, 1), qe)(y = S[v]) !== (w = d[v]) && "perspective,force3D,transformOrigin,svgOrigin".indexOf(v) < 0 && (b = Ia(y) !== (C = Ia(w)) ? pd(c, v, y, C) : parseFloat(y), T = parseFloat(w), e._pt = new le(e._pt, S, v, b, T - b, Qc), e._pt.u = C || 0, e._props.push(v));
        pe.body.removeChild(ve)
    }
    Kt.version = Gt.version = ce.version = "3.2.0", w = 1, t() && Bt();
    var de, pe, _e, me, ge, ve, ye, we, be = It.Power0,
        xe = It.Power1,
        Te = It.Power2,
        Me = It.Power3,
        ke = It.Power4,
        Oe = It.Linear,
        Ce = It.Quad,
        Pe = It.Cubic,
        Se = It.Quart,
        Ae = It.Quint,
        Ee = It.Strong,
        De = It.Elastic,
        ze = It.Back,
        Fe = It.SteppedEase,
        Re = It.Bounce,
        Be = It.Sine,
        Ie = It.Expo,
        Le = It.Circ,
        qe = {},
        Ne = 180 / Math.PI,
        Ye = Math.PI / 180,
        je = Math.atan2,
        Ve = /([A-Z])/g,
        Ue = /(?:left|right|width|margin|padding|x)/i,
        Ge = /[\s,\(]\S/,
        Xe = {
            autoAlpha: "opacity,visibility",
            scale: "scaleX,scaleY",
            alpha: "opacity"
        },
        Ze = "transform",
        Qe = Ze + "Origin",
        We = "O,Moz,ms,Ms,Webkit".split(","),
        He = function _checkPropPrefix(e, a, c) {
            var d = (a || ge).style,
                v = 5;
            if (e in d && !c) return e;
            for (e = e.charAt(0).toUpperCase() + e.substr(1); v-- && !(We[v] + e in d););
            return v < 0 ? null : (3 === v ? "ms" : 0 <= v ? We[v] : "") + e
        },
        $e = {
            deg: 1,
            rad: 1,
            turn: 1
        },
        Ke = {
            top: "0%",
            bottom: "100%",
            left: "0%",
            right: "100%",
            center: "50%"
        },
        Je = {
            clearProps: function clearProps(e, a, c, d, v) {
                if ("isFromStart" !== v.data) {
                    var y = e._pt = new le(e._pt, a, c, 0, 0, ud);
                    return y.u = d, y.pr = -10, y.tween = v, e._props.push(c), 1
                }
            }
        },
        tn = [1, 0, 0, 1, 0, 0],
        en = {},
        nn = function _parseTransform(e, a) {
            var c = e._gsap || new Vt(e);
            if ("x" in c && !a && !c.uncache) return c;
            var d, v, y, w, b, T, C, P, S, A, E, D, z, F, R, B, I, V, U, G, X, W, H, J, tt, et, nt, rt, it, at, st = e.style,
                ot = c.scaleX < 0,
                ut = c.xOrigin || 0,
                ht = c.yOrigin || 0,
                lt = "deg",
                ft = ed(e, Qe) || "0";
            return d = v = y = T = C = P = S = A = E = 0, w = b = 1, c.svg = !(!e.getCTM || !ld(e)), D = Ad(e, c.svg), c.svg && Bd(e, ft, c.originIsAbsolute, !1 !== c.smooth, D), D !== tn && (B = D[0], I = D[1], V = D[2], U = D[3], d = G = D[4], v = X = D[5], 6 === D.length ? (w = Math.sqrt(B * B + I * I), b = Math.sqrt(U * U + V * V), T = B || I ? je(I, B) * Ne : 0, S = V || U ? je(V, U) * Ne + T : 0, c.svg && (d -= ut - (ut * B + ht * V), v -= ht - (ut * I + ht * U))) : (at = D[6], rt = D[7], tt = D[8], et = D[9], nt = D[10], it = D[11], d = D[12], v = D[13], y = D[14], C = (z = je(at, nt)) * Ne, z && (W = G * (F = Math.cos(-z)) + tt * (R = Math.sin(-z)), H = X * F + et * R, J = at * F + nt * R, tt = G * -R + tt * F, et = X * -R + et * F, nt = at * -R + nt * F, it = rt * -R + it * F, G = W, X = H, at = J), P = (z = je(-V, nt)) * Ne, z && (F = Math.cos(-z), it = U * (R = Math.sin(-z)) + it * F, B = W = B * F - tt * R, I = H = I * F - et * R, V = J = V * F - nt * R), T = (z = je(I, B)) * Ne, z && (W = B * (F = Math.cos(z)) + I * (R = Math.sin(z)), H = G * F + X * R, I = I * F - B * R, X = X * F - G * R, B = W, G = H), C && 359.9 < Math.abs(C) + Math.abs(T) && (C = T = 0, P = 180 - P), w = aa(Math.sqrt(B * B + I * I + V * V)), b = aa(Math.sqrt(X * X + at * at)), z = je(G, X), S = 2e-4 < Math.abs(z) ? z * Ne : 0, E = it ? 1 / (it < 0 ? -it : it) : 0), c.svg && (D = e.getAttribute("transform"), c.forceCSS = e.setAttribute("transform", "") || !yd(ed(e, Ze)), D && e.setAttribute("transform", D))), 90 < Math.abs(S) && Math.abs(S) < 270 && (ot ? (w *= -1, S += T <= 0 ? 180 : -180, T += T <= 0 ? 180 : -180) : (b *= -1, S += S <= 0 ? 180 : -180)), c.x = ((c.xPercent = d && Math.round(e.offsetWidth / 2) === Math.round(-d) ? -50 : 0) ? 0 : d) + "px", c.y = ((c.yPercent = v && Math.round(e.offsetHeight / 2) === Math.round(-v) ? -50 : 0) ? 0 : v) + "px", c.z = y + "px", c.scaleX = aa(w), c.scaleY = aa(b), c.rotation = aa(T) + lt, c.rotationX = aa(C) + lt, c.rotationY = aa(P) + lt, c.skewX = S + lt, c.skewY = A + lt, c.transformPerspective = E + "px", (c.zOrigin = parseFloat(ft.split(" ")[2]) || 0) && (st[Qe] = rn(ft)), c.xOffset = c.yOffset = 0, c.force3D = Q.force3D, c.renderTransform = c.svg ? ln : we ? hn : an, c.uncache = 0, c
        },
        rn = function _firstTwoOnly(e) {
            return (e = e.split(" "))[0] + " " + e[1]
        },
        an = function _renderNon3DTransforms(e, a) {
            a.z = "0px", a.rotationY = a.rotationX = "0deg", a.force3D = 0, hn(e, a)
        },
        sn = "0deg",
        on = "0px",
        un = ") ",
        hn = function _renderCSSTransforms(e, a) {
            var c = a || this,
                d = c.xPercent,
                v = c.yPercent,
                y = c.x,
                w = c.y,
                b = c.z,
                T = c.rotation,
                C = c.rotationY,
                P = c.rotationX,
                S = c.skewX,
                A = c.skewY,
                E = c.scaleX,
                D = c.scaleY,
                z = c.transformPerspective,
                F = c.force3D,
                R = c.target,
                B = c.zOrigin,
                I = "",
                V = "auto" === F && e && 1 !== e || !0 === F;
            if (B && (P !== sn || C !== sn)) {
                var U, G = parseFloat(C) * Ye,
                    X = Math.sin(G),
                    Q = Math.cos(G);
                G = parseFloat(P) * Ye, y = Ed(R, y, X * (U = Math.cos(G)) * -B), w = Ed(R, w, -Math.sin(G) * -B), b = Ed(R, b, Q * U * -B + B)
            }
            z !== on && (I += "perspective(" + z + un), (d || v) && (I += "translate(" + d + "%, " + v + "%) "), !V && y === on && w === on && b === on || (I += b !== on || V ? "translate3d(" + y + ", " + w + ", " + b + ") " : "translate(" + y + ", " + w + un), T !== sn && (I += "rotate(" + T + un), C !== sn && (I += "rotateY(" + C + un), P !== sn && (I += "rotateX(" + P + un), S === sn && A === sn || (I += "skew(" + S + ", " + A + un), 1 === E && 1 === D || (I += "scale(" + E + ", " + D + un), R.style[Ze] = I || "translate(0, 0)"
        },
        ln = function _renderSVGTransforms(e, a) {
            var c, d, v, y, w, b = a || this,
                T = b.xPercent,
                C = b.yPercent,
                P = b.x,
                S = b.y,
                A = b.rotation,
                E = b.skewX,
                D = b.skewY,
                z = b.scaleX,
                F = b.scaleY,
                R = b.target,
                B = b.xOrigin,
                I = b.yOrigin,
                V = b.xOffset,
                U = b.yOffset,
                G = b.forceCSS,
                X = parseFloat(P),
                Q = parseFloat(S);
            A = parseFloat(A), E = parseFloat(E), (D = parseFloat(D)) && (E += D = parseFloat(D), A += D), A || E ? (A *= Ye, E *= Ye, c = Math.cos(A) * z, d = Math.sin(A) * z, v = Math.sin(A - E) * -F, y = Math.cos(A - E) * F, E && (D *= Ye, w = Math.tan(E - D), v *= w = Math.sqrt(1 + w * w), y *= w, D && (w = Math.tan(D), c *= w = Math.sqrt(1 + w * w), d *= w)), c = aa(c), d = aa(d), v = aa(v), y = aa(y)) : (c = z, y = F, d = v = 0), (X && !~(P + "").indexOf("px") || Q && !~(S + "").indexOf("px")) && (X = pd(R, "x", P, "px"), Q = pd(R, "y", S, "px")), (B || I || V || U) && (X = aa(X + B - (B * c + I * v) + V), Q = aa(Q + I - (B * d + I * y) + U)), (T || C) && (X = aa(X + T / 100 * (w = R.getBBox()).width), Q = aa(Q + C / 100 * w.height)), w = "matrix(" + c + "," + d + "," + v + "," + y + "," + X + "," + Q + ")", R.setAttribute("transform", w), G && (R.style[Ze] = w)
        };
    _("padding,margin,Width,Radius", (function(e, a) {
        var c = "Right",
            d = "Bottom",
            v = "Left",
            y = (a < 3 ? ["Top", c, d, v] : ["Top" + v, "Top" + c, d + c, d + v]).map((function(c) {
                return a < 2 ? e + c : "border" + c + e
            }));
        Je[1 < a ? "border" + e : e] = function(e, a, c, d, v) {
            var w, b;
            if (arguments.length < 4) return w = y.map((function(a) {
                return qd(e, a, c)
            })), 5 === (b = w.join(" ")).split(w[0]).length ? w[0] : b;
            w = (d + "").split(" "), b = {}, y.forEach((function(e, a) {
                return b[e] = w[a] = w[a] || w[(a - 1) / 2 | 0]
            })), e.init(a, b, v)
        }
    }));
    var fn, cn, dn = {
        name: "css",
        register: hd,
        targetTest: function targetTest(e) {
            return e.style && e.nodeType
        },
        init: function init(e, a, c, d, v) {
            var y, w, b, T, C, P, S, A, E, D, z, F, R, B, I, V = this._props,
                U = e.style;
            for (S in me || hd(), a)
                if ("autoRound" !== S && (w = a[S], !vt[S] || !Ib(S, a, c, d, e, v)))
                    if (C = typeof w, P = Je[S], "function" === C && (C = typeof(w = w.call(c, d, e, v))), "string" === C && ~w.indexOf("random(") && (w = Za(w)), P) P(this, e, S, w, c) && (I = 1);
                    else if ("--" === S.substr(0, 2)) this.add(U, "setProperty", getComputedStyle(e).getPropertyValue(S) + "", w + "", d, v, 0, 0, S);
            else {
                if (y = qd(e, S), T = parseFloat(y), (D = "string" === C && "=" === w.charAt(1) ? +(w.charAt(0) + "1") : 0) && (w = w.substr(2)), b = parseFloat(w), S in Xe && ("autoAlpha" === S && (1 === T && "hidden" === qd(e, "visibility") && b && (T = 0), nd(this, U, "visibility", T ? "inherit" : "hidden", b ? "inherit" : "hidden", !b)), "scale" !== S && "transform" !== S && ~(S = Xe[S]).indexOf(",") && (S = S.split(",")[0])), z = S in qe)
                    if (F || ((R = e._gsap).renderTransform || nn(e), B = !1 !== a.smoothOrigin && R.smooth, (F = this._pt = new le(this._pt, U, Ze, 0, 1, R.renderTransform, R, 0, -1)).dep = 1), "scale" === S) this._pt = new le(this._pt, R, "scaleY", R.scaleY, D ? D * b : b - R.scaleY), V.push("scaleY", S), S += "X";
                    else {
                        if ("transformOrigin" === S) {
                            w = td(w), R.svg ? Bd(e, w, 0, B, 0, this) : ((E = parseFloat(w.split(" ")[2])) !== R.zOrigin && nd(this, R, "zOrigin", R.zOrigin, E), nd(this, U, S, rn(y), rn(w)));
                            continue
                        }
                        if ("svgOrigin" === S) {
                            Bd(e, w, 1, B, 0, this);
                            continue
                        }
                        if (S in en) {
                            Ld(this, R, S, T, w, D);
                            continue
                        }
                        if ("smoothOrigin" === S) {
                            nd(this, R, "smooth", R.smooth, w);
                            continue
                        }
                        if ("force3D" === S) {
                            R[S] = w;
                            continue
                        }
                        if ("transform" === S) {
                            Md(this, w, e);
                            continue
                        }
                    }
                else S in U || (S = He(S) || S);
                if (z || (b || 0 === b) && (T || 0 === T) && !Ge.test(w) && S in U)(A = (y + "").substr((T + "").length)) !== (E = (w + "").substr((b + "").length) || (S in Q.units ? Q.units[S] : A)) && (T = pd(e, S, y, E)), this._pt = new le(this._pt, z ? R : U, S, T, D ? D * b : b - T, "px" !== E || !1 === a.autoRound || z ? Qc : Tc), this._pt.u = E || 0, A !== E && (this._pt.b = y, this._pt.r = Sc);
                else if (S in U) rd.call(this, e, S, y, w);
                else {
                    if (!(S in e)) {
                        L(S, w);
                        continue
                    }
                    this.add(e, S, e[S], w, d, v)
                }
                V.push(S)
            }
            I && he(this)
        },
        get: qd,
        aliases: Xe,
        getSetter: function getSetter(e, a, c) {
            var d = Xe[a];
            return d && d.indexOf(",") < 0 && (a = d), a in qe && a !== Qe && (e._gsap.x || qd(e, "x")) ? c && ye === c ? "scale" === a ? Zc : Yc : (ye = c || {}) && ("scale" === a ? $c : _c) : e.style && !q(e.style[a]) ? Wc : ~a.indexOf("-") ? Xc : ne(e, a)
        }
    };
    ce.utils.checkPrefix = He, cn = _("x,y,z,scale,scaleX,scaleY,xPercent,yPercent" + "," + (fn = "rotation,rotationX,rotationY,skewX,skewY") + ",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", (function(e) {
        qe[e] = 1
    })), _(fn, (function(e) {
        Q.units[e] = "deg", en[e] = 1
    })), Xe[cn[13]] = "x,y,z,scale,scaleX,scaleY,xPercent,yPercent," + fn, _("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY", (function(e) {
        var a = e.split(":");
        Xe[a[1]] = cn[a[0]]
    })), _("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", (function(e) {
        Q.units[e] = "px"
    })), ce.registerPlugin(dn);
    var pn = ce.registerPlugin(dn) || ce,
        _n = pn.core.Tween;
    e.Back = ze, e.Bounce = Re, e.CSSPlugin = dn, e.Circ = Le, e.Cubic = Pe, e.Elastic = De, e.Expo = Ie, e.Linear = Oe, e.Power0 = be, e.Power1 = xe, e.Power2 = Te, e.Power3 = Me, e.Power4 = ke, e.Quad = Ce, e.Quart = Se, e.Quint = Ae, e.Sine = Be, e.SteppedEase = Fe, e.Strong = Ee, e.TimelineLite = Gt, e.TimelineMax = Gt, e.TweenLite = Kt, e.TweenMax = _n, e.default = pn, e.gsap = pn, "undefined" == typeof window || window !== e ? Object.defineProperty(e, "__esModule", {
        value: !0
    }) : delete e.default
})),
function(e, a) {
    "object" == typeof exports && "undefined" != typeof module ? a(exports) : "function" == typeof define && define.amd ? define(["exports"], a) : a((e = e || self).window = e.window || {})
}(this, (function(e) {
    "use strict";

    function m(e) {
        return Math.round(1e5 * e) / 1e5 || 0
    }
    var a = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        c = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
        d = Math.PI / 180,
        v = Math.sin,
        y = Math.cos,
        w = Math.abs,
        b = Math.sqrt;

    function arcToSegment(e, a, c, T, C, P, S, A, E) {
        if (e !== A || a !== E) {
            c = w(c), T = w(T);
            var D = C % 360 * d,
                z = y(D),
                F = v(D),
                R = Math.PI,
                B = 2 * R,
                I = (e - A) / 2,
                V = (a - E) / 2,
                U = z * I + F * V,
                G = -F * I + z * V,
                X = U * U,
                Q = G * G,
                W = X / (c * c) + Q / (T * T);
            1 < W && (c = b(W) * c, T = b(W) * T);
            var H = c * c,
                J = T * T,
                tt = (H * J - H * Q - J * X) / (H * Q + J * X);
            tt < 0 && (tt = 0);
            var et = (P === S ? -1 : 1) * b(tt),
                nt = c * G / T * et,
                rt = -T * U / c * et,
                it = z * nt - F * rt + (e + A) / 2,
                at = F * nt + z * rt + (a + E) / 2,
                st = (U - nt) / c,
                ot = (G - rt) / T,
                ut = (-U - nt) / c,
                ht = (-G - rt) / T,
                lt = st * st + ot * ot,
                ft = (ot < 0 ? -1 : 1) * Math.acos(st / b(lt)),
                ct = (st * ht - ot * ut < 0 ? -1 : 1) * Math.acos((st * ut + ot * ht) / b(lt * (ut * ut + ht * ht)));
            isNaN(ct) && (ct = R), !S && 0 < ct ? ct -= B : S && ct < 0 && (ct += B), ft %= B, ct %= B;
            var dt, pt = Math.ceil(w(ct) / (B / 4)),
                _t = [],
                mt = ct / pt,
                gt = 4 / 3 * v(mt / 2) / (1 + y(mt / 2)),
                vt = z * c,
                yt = F * c,
                wt = F * -T,
                bt = z * T;
            for (dt = 0; dt < pt; dt++) U = y(C = ft + dt * mt), G = v(C), st = y(C += mt), ot = v(C), _t.push(U - gt * G, G + gt * U, st + gt * ot, ot - gt * st, st, ot);
            for (dt = 0; dt < _t.length; dt += 2) U = _t[dt], G = _t[dt + 1], _t[dt] = U * vt + G * wt + it, _t[dt + 1] = U * yt + G * bt + at;
            return _t[dt - 2] = A, _t[dt - 1] = E, _t
        }
    }

    function p() {
        return T || "undefined" != typeof window && (T = window.gsap) && T.registerPlugin && T
    }

    function q() {
        (T = p()) ? (T.registerEase("_CE", E.create), C = 1) : console.warn("Please gsap.registerPlugin(CustomEase)")
    }

    function s(e) {
        return ~~(1e3 * e + (e < 0 ? -.5 : .5)) / 1e3
    }

    function x(e, a, c, d, v, y, w, b, T, C, P) {
        var S, A = (e + c) / 2,
            E = (a + d) / 2,
            D = (c + v) / 2,
            z = (d + y) / 2,
            F = (v + w) / 2,
            R = (y + b) / 2,
            B = (A + D) / 2,
            I = (E + z) / 2,
            V = (D + F) / 2,
            U = (z + R) / 2,
            G = (B + V) / 2,
            X = (I + U) / 2,
            Q = w - e,
            W = b - a,
            H = Math.abs((c - w) * W - (d - b) * Q),
            J = Math.abs((v - w) * W - (y - b) * Q);
        return C || (C = [{
            x: e,
            y: a
        }, {
            x: w,
            y: b
        }], P = 1), C.splice(P || C.length - 1, 0, {
            x: G,
            y: X
        }), T * (Q * Q + W * W) < (H + J) * (H + J) && (S = C.length, x(e, a, A, E, B, I, G, X, T, C, P), x(G, X, V, U, F, R, w, b, T, C, P + 1 + (C.length - S))), C
    }
    var T, C, P, S = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
        A = /[cLlsSaAhHvVtTqQ]/g,
        E = ((P = CustomEase.prototype).setData = function setData(e, d) {
            d = d || {};
            var v, y, b, C, P, E, D, z, F, R = (e = e || "0,0,1,1").match(S),
                B = 1,
                I = [],
                V = [],
                U = d.precision || 1,
                G = U <= 1;
            if (this.data = e, (A.test(e) || ~e.indexOf("M") && e.indexOf("C") < 0) && (R = function stringToRawPath(e) {
                    function db(e, a, c, d) {
                        E = (c - e) / 3, D = (d - a) / 3, P.push(e + E, a + D, c - E, d - D, c, d)
                    }
                    var d, v, y, b, T, C, P, S, A, E, D, z, F, R, B, I = (e + "").replace(c, (function(e) {
                            var a = +e;
                            return a < 1e-4 && -1e-4 < a ? 0 : a
                        })).match(a) || [],
                        V = [],
                        U = 0,
                        G = 0,
                        X = I.length,
                        Q = 0,
                        W = "ERROR: malformed path: " + e;
                    if (!e || !isNaN(I[0]) || isNaN(I[1])) return console.log(W), V;
                    for (d = 0; d < X; d++)
                        if (F = T, isNaN(I[d]) ? C = (T = I[d].toUpperCase()) !== I[d] : d--, y = +I[d + 1], b = +I[d + 2], C && (y += U, b += G), d || (S = y, A = b), "M" === T) P && (P.length < 8 ? --V.length : Q += P.length), U = S = y, G = A = b, P = [y, b], V.push(P), d += 2, T = "L";
                        else if ("C" === T) C || (U = G = 0), (P = P || [0, 0]).push(y, b, U + 1 * I[d + 3], G + 1 * I[d + 4], U += 1 * I[d + 5], G += 1 * I[d + 6]), d += 6;
                    else if ("S" === T) E = U, D = G, "C" !== F && "S" !== F || (E += U - P[P.length - 4], D += G - P[P.length - 3]), C || (U = G = 0), P.push(E, D, y, b, U += 1 * I[d + 3], G += 1 * I[d + 4]), d += 4;
                    else if ("Q" === T) E = U + 2 / 3 * (y - U), D = G + 2 / 3 * (b - G), C || (U = G = 0), U += 1 * I[d + 3], G += 1 * I[d + 4], P.push(E, D, U + 2 / 3 * (y - U), G + 2 / 3 * (b - G), U, G), d += 4;
                    else if ("T" === T) E = U - P[P.length - 4], D = G - P[P.length - 3], P.push(U + E, G + D, y + 2 / 3 * (U + 1.5 * E - y), b + 2 / 3 * (G + 1.5 * D - b), U = y, G = b), d += 2;
                    else if ("H" === T) db(U, G, U = y, G), d += 1;
                    else if ("V" === T) db(U, G, U, G = y + (C ? G - U : 0)), d += 1;
                    else if ("L" === T || "Z" === T) "Z" === T && (y = S, b = A, P.closed = !0), ("L" === T || .5 < w(U - y) || .5 < w(G - b)) && (db(U, G, y, b), "L" === T && (d += 2)), U = y, G = b;
                    else if ("A" === T) {
                        if (R = I[d + 4], B = I[d + 5], E = I[d + 6], D = I[d + 7], v = 7, 1 < R.length && (R.length < 3 ? (D = E, E = B, v--) : (D = B, E = R.substr(2), v -= 2), B = R.charAt(1), R = R.charAt(0)), z = arcToSegment(U, G, +I[d + 1], +I[d + 2], +I[d + 3], +R, +B, (C ? U : 0) + 1 * E, (C ? G : 0) + 1 * D), d += v, z)
                            for (v = 0; v < z.length; v++) P.push(z[v]);
                        U = P[P.length - 2], G = P[P.length - 1]
                    } else console.log(W);
                    return (d = P.length) < 6 ? (V.pop(), d = 0) : P[0] === P[d - 2] && P[1] === P[d - 1] && (P.closed = !0), V.totalPoints = Q + d, V
                }(e)[0]), 4 === (v = R.length)) R.unshift(0, 0), R.push(1, 1), v = 8;
            else if ((v - 2) % 6) throw "Invalid CustomEase";
            for (0 == +R[0] && 1 == +R[v - 2] || function _normalize(e, a, c) {
                    c || 0 === c || (c = Math.max(+e[e.length - 1], +e[1]));
                    var d, v = -1 * e[0],
                        y = -c,
                        w = e.length,
                        b = 1 / (+e[w - 2] + v),
                        T = -a || (Math.abs(e[w - 1] - e[1]) < .01 * (e[w - 2] - e[0]) ? function _findMinimum(e) {
                            var a, c = e.length,
                                d = 1e20;
                            for (a = 1; a < c; a += 6) + e[a] < d && (d = +e[a]);
                            return d
                        }(e) + y : +e[w - 1] + y);
                    for (T = T ? 1 / T : -b, d = 0; d < w; d += 2) e[d] = (+e[d] + v) * b, e[d + 1] = (+e[d + 1] + y) * T
                }(R, d.height, d.originY), this.segment = R, C = 2; C < v; C += 6) y = {
                x: +R[C - 2],
                y: +R[C - 1]
            }, b = {
                x: +R[C + 4],
                y: +R[C + 5]
            }, I.push(y, b), x(y.x, y.y, +R[C], +R[C + 1], +R[C + 2], +R[C + 3], b.x, b.y, 1 / (2e5 * U), I, I.length - 1);
            for (v = I.length, C = 0; C < v; C++) D = I[C], z = I[C - 1] || D, (D.x > z.x || z.y !== D.y && z.x === D.x || D === z) && D.x <= 1 ? (z.cx = D.x - z.x, z.cy = D.y - z.y, z.n = D, z.nx = D.x, G && 1 < C && 2 < Math.abs(z.cy / z.cx - I[C - 2].cy / I[C - 2].cx) && (G = 0), z.cx < B && (z.cx ? B = z.cx : (z.cx = .001, C === v - 1 && (z.x -= .001, B = Math.min(B, .001), G = 0)))) : (I.splice(C--, 1), v--);
            if (P = 1 / (v = 1 / B + 1 | 0), D = I[E = 0], G) {
                for (C = 0; C < v; C++) F = C * P, D.nx < F && (D = I[++E]), y = D.y + (F - D.x) / D.cx * D.cy, V[C] = {
                    x: F,
                    cx: P,
                    y: y,
                    cy: 0,
                    nx: 9
                }, C && (V[C - 1].cy = y - V[C - 1].y);
                V[v - 1].cy = I[I.length - 1].y - y
            } else {
                for (C = 0; C < v; C++) D.nx < C * P && (D = I[++E]), V[C] = D;
                E < I.length - 1 && (V[C - 1] = I[I.length - 2])
            }
            return this.ease = function(e) {
                var a = V[e * v | 0] || V[v - 1];
                return a.nx < e && (a = a.n), a.y + (e - a.x) / a.cx * a.cy
            }, (this.ease.custom = this).id && T.registerEase(this.id, this.ease), this
        }, P.getSVGData = function getSVGData(e) {
            return CustomEase.getSVGData(this, e)
        }, CustomEase.create = function create(e, a, c) {
            return new CustomEase(e, a, c).ease
        }, CustomEase.register = function register(e) {
            T = e, q()
        }, CustomEase.get = function get(e) {
            return T.parseEase(e)
        }, CustomEase.getSVGData = function getSVGData(e, a) {
            var c, d, v, y, w, b, C, P, S, A, E = (a = a || {}).width || 100,
                D = a.height || 100,
                z = a.x || 0,
                F = (a.y || 0) + D,
                R = T.utils.toArray(a.path)[0];
            if (a.invert && (D = -D, F = 0), "string" == typeof e && (e = T.parseEase(e)), e.custom && (e = e.custom), e instanceof CustomEase) c = function rawPathToString(e) {
                ! function _isNumber(e) {
                    return "number" == typeof e
                }(e[0]) || (e = [e]);
                var a, c, d, v, y = "",
                    w = e.length;
                for (c = 0; c < w; c++) {
                    for (y += "M" + m((v = e[c])[0]) + "," + m(v[1]) + " C", a = v.length, d = 2; d < a; d++) y += m(v[d++]) + "," + m(v[d++]) + " " + m(v[d++]) + "," + m(v[d++]) + " " + m(v[d++]) + "," + m(v[d]) + " ";
                    v.closed && (y += "z")
                }
                return y
            }(function transformRawPath(e, a, c, d, v, y, w) {
                for (var b, T, C, P, S, A = e.length; - 1 < --A;)
                    for (T = (b = e[A]).length, C = 0; C < T; C += 2) P = b[C], S = b[C + 1], b[C] = P * a + S * d + y, b[C + 1] = P * c + S * v + w;
                return e._dirty = 1, e
            }([e.segment], E, 0, 0, -D, z, F));
            else {
                for (c = [z, F], y = 1 / (C = Math.max(5, 200 * (a.precision || 1))), P = 5 / (C += 2), S = s(z + y * E), d = ((A = s(F + e(y) * -D)) - F) / (S - z), v = 2; v < C; v++) w = s(z + v * y * E), b = s(F + e(v * y) * -D), (Math.abs((b - A) / (w - S) - d) > P || v === C - 1) && (c.push(S, A), d = (b - A) / (w - S)), S = w, A = b;
                c = "M" + c.join(",")
            }
            return R && R.setAttribute("d", c), c
        }, CustomEase);

    function CustomEase(e, a, c) {
        C || q(), this.id = e, this.setData(a, c)
    }
    p() && T.registerPlugin(E), E.version = "3.5.1", e.CustomEase = E, e.default = E, "undefined" == typeof window || window !== e ? Object.defineProperty(e, "__esModule", {
        value: !0
    }) : delete e.default
})),
function(e, a) {
    "object" == typeof exports && "undefined" != typeof module ? a(exports) : "function" == typeof define && define.amd ? define(["exports"], a) : a((e = e || self).window = e.window || {})
}(this, (function(e) {
    "use strict";

    function f() {
        return a || "undefined" != typeof window && (a = window.gsap) && a.registerPlugin && a
    }

    function g(e, a) {
        return !!(void 0 === e ? a : e && !~(e + "").indexOf("false"))
    }

    function h(e) {
        if (a = e || f()) {
            c = a.registerEase;
            var b, T = a.parseEase(),
                C = function createConfig(e) {
                    return function(a) {
                        var c = .5 + a / 2;
                        e.config = function(a) {
                            return e(2 * (1 - a) * a * c + a * a)
                        }
                    }
                };
            for (b in T) T[b].config || C(T[b]);
            for (b in c("slow", d), c("expoScale", v), c("rough", y), w) "version" !== b && a.core.globals(b, w[b])
        }
    }

    function i(e, a, c) {
        var d = (e = Math.min(1, e || .7)) < 1 ? a || 0 === a ? a : .7 : 0,
            v = (1 - e) / 2,
            y = v + e,
            w = g(c);
        return function(e) {
            var a = e + (.5 - e) * d;
            return e < v ? w ? 1 - (e = 1 - e / v) * e : a - (e = 1 - e / v) * e * e * e * a : y < e ? w ? 1 === e ? 0 : 1 - (e = (e - y) / v) * e : a + (e - a) * (e = (e - y) / v) * e * e * e : w ? 1 : a
        }
    }

    function j(e, c, d) {
        var v = Math.log(c / e),
            y = c - e;
        return d = d && a.parseEase(d),
            function(a) {
                return (e * Math.exp(v * (d ? d(a) : a)) - e) / y
            }
    }

    function k(e, a, c) {
        this.t = e, this.v = a, c && (((this.next = c).prev = this).c = c.v - a, this.gap = c.t - e)
    }

    function l(e) {
        "object" != typeof e && (e = {
            points: +e || 20
        });
        for (var c, d, v, y, w, b, T, C = e.taper || "none", P = [], S = 0, A = 0 | (+e.points || 20), E = A, D = g(e.randomize, !0), z = g(e.clamp), F = a ? a.parseEase(e.template) : 0, R = .4 * (+e.strength || 1); - 1 < --E;) c = D ? Math.random() : 1 / A * E, d = F ? F(c) : c, v = "none" === C ? R : "out" === C ? (y = 1 - c) * y * R : "in" === C ? c * c * R : c < .5 ? (y = 2 * c) * y * .5 * R : (y = 2 * (1 - c)) * y * .5 * R, D ? d += Math.random() * v - .5 * v : E % 2 ? d += .5 * v : d -= .5 * v, z && (1 < d ? d = 1 : d < 0 && (d = 0)), P[S++] = {
            x: c,
            y: d
        };
        for (P.sort((function(e, a) {
                return e.x - a.x
            })), b = new k(1, 1, null), E = A; E--;) b = new k((w = P[E]).x, w.y, b);
        return T = new k(0, 0, b.t ? b : b.next),
            function(e) {
                var a = T;
                if (e > a.t) {
                    for (; a.next && e >= a.t;) a = a.next;
                    a = a.prev
                } else
                    for (; a.prev && e <= a.t;) a = a.prev;
                return (T = a).v + (e - a.t) / a.gap * a.c
            }
    }
    var a, c, d = i(.7);
    (d.ease = d).config = i;
    var v = j(1, 2);
    v.config = j;
    var y = l();
    (y.ease = y).config = l;
    var w = {
        SlowMo: d,
        RoughEase: y,
        ExpoScaleEase: v
    };
    for (var b in w) w[b].register = h, w[b].version = "3.5.1";
    f() && a.registerPlugin(d), e.EasePack = w, e.ExpoScaleEase = v, e.RoughEase = y, e.SlowMo = d, e.default = w, "undefined" == typeof window || window !== e ? Object.defineProperty(e, "__esModule", {
        value: !0
    }) : delete e.default
}));
var Spear = pc.createScript("spear");
Spear.attributes.add("shaft", {
    type: "entity"
}), Spear.attributes.add("head", {
    type: "entity"
}), Spear.attributes.add("owner", {
    type: "entity"
}), Spear.attributes.add("line", {
    type: "entity",
    array: !0
}), Spear.prototype.postInitialize = function() {
    this._point = new pc.Vec2, this._line = [new pc.Vec2, new pc.Vec2], this._tween = null
}, Spear.prototype.getPoint = function() {
    var t = this.head.getPosition();
    return this._point.set(t.x, t.z), this._point
}, Spear.prototype.getLine = function() {
    var t = this.line[0].getPosition(),
        e = this.line[1].getPosition();
    return this._line[0].set(t.x, t.z), this._line[1].set(e.x, e.z), this._line
}, Spear.prototype.update = function() {
    Gizmo.line(new pc.Vec3(this._line[0].x, 0, this._line[0].y), new pc.Vec3(this._line[1].x, 0, this._line[1].y), Gizmo.MAGENTA_GIZMO)
};
var ShieldState = {
        IDLE: "idle",
        APPEAR: "appear",
        PROTECTING: "protecting",
        DISAPPEAR: "disappear"
    },
    Shield = pc.createScript("shield");
Shield.attributes.add("protectTime", {
    type: "number"
}), Shield.attributes.add("appearTime", {
    type: "number"
}), Shield.prototype.manualInit = function() {
    this.active = !1, this._state = ShieldState.IDLE, this._opacity = 0, this.time = 0, this.blinkTime = 0, this.currentAppearTime = 0, this._shader = Helper.getShader("shaderShield").getShaderInstance(), this.entity.script.skinComponent._skin.shieldVisual.model.meshInstances[0].material = this._shader.material, this._shader.injectMeshInsance([this.entity.script.skinComponent._skin.shieldVisual.model.meshInstances[0]]), this.blinkingSpeed = this._shader.blinkingSpeed, this._shader.time = 1, this._shader.appearTime = 1, this._shader.update(), this.entity.script.skinComponent.getSkin().shieldVisual.model.enabled = !1
}, Shield.prototype.launch = function() {
    this.time = 0, this.active = !0, this.entity.script.skinComponent.getSkin().shieldVisual.model.enabled = !0, this._state = ShieldState.APPEAR
}, Shield.prototype.idle = function(e) {}, Shield.prototype.appear = function(e) {
    this.currentAppearTime = Math.min(this.appearTime, this.currentAppearTime + e);
    var t = this.currentAppearTime / this.appearTime;
    this._shader.appearTime = 1 - t, this._shader.time = 1, this._shader.update(), t >= 1 && (this._state = ShieldState.PROTECTING)
}, Shield.prototype.protecting = function(e) {
    this.time += e, this.blinkTime += e * this.blinkingSpeed;
    var t = this.blinkTime % 2;
    t > 1 && (t = 1 - (t - 1)), this._shader.time = 1 - t, this._shader.update(), Utils.lastSecond(this.protectTime - this.time) ? this.entity.script.skinComponent.getSkin().shieldVisual.model.enabled = !0 : this.entity.script.skinComponent.getSkin().shieldVisual.model.enabled = !1, this.time >= this.protectTime && (this._state = ShieldState.DISAPPEAR)
}, Shield.prototype.disappear = function(e) {
    this.currentAppearTime = Math.max(0, this.currentAppearTime - e);
    var t = this.currentAppearTime / this.appearTime;
    this._shader.appearTime = 1 - t, this._shader.update(), t <= 0 && (this.entity.script.skinComponent.getSkin().shieldVisual.model.enabled = !1, this.active = !1, this._state = ShieldState.IDLE)
}, Shield.prototype.update = function(e) {
    Helper.reloading || this[this._state](e * Helper.game.timeScale)
};
var PowerupNitro = pc.createScript("powerupNitro");
PowerupNitro.attributes.add("nitroTime", {
    type: "number"
}), PowerupNitro.attributes.add("nitroVelocity", {
    type: "vec2"
}), PowerupNitro.prototype.initialize = function() {
    this._time = 0, this._originalVelocity = new pc.Vec2
}, PowerupNitro.prototype.postInitialize = function() {
    const t = this.entity.script.player.velocity;
    this._originalVelocity.set(t.x, t.y)
}, PowerupNitro.prototype.launchEndless = function() {
    this.nitroTime = 999, this.launch()
}, PowerupNitro.prototype.active = function() {
    return this._time > 0
}, PowerupNitro.prototype.launch = function() {
    this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (this._time = this.nitroTime, this.entity.script.player.velocity.set(this.nitroVelocity.x, this.nitroVelocity.y), "player" == this.entity.script.actor.id && Helper.camera.toSpeedUpHeight(), this.entity.script.skinComponent._skin.turnOnNitro())
}, PowerupNitro.prototype.update = function(t) {
    Helper.reloading || this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (t *= Helper.game.timeScale, this._time > 0 && (this._time = Math.max(0, this._time - t), Utils.lastSecond(this._time) ? this.entity.script.skinComponent._skin.turnOnNitro() : this.entity.script.skinComponent._skin.turnOffNitro(), Helper.math.approximately(this._time, 0) && (this.entity.script.player.velocity.set(this._originalVelocity.x, this._originalVelocity.y), "player" == this.entity.script.actor.id && Helper.camera.toNormalHeight(), this.entity.script.skinComponent._skin.turnOffNitro())))
}, PowerupNitro.prototype.turnOff = function(t) {
    this._time > 0 && (this._time = 0, this.entity.script.player.velocity.set(this._originalVelocity.x, this._originalVelocity.y), this.entity.script.skinComponent._skin.turnOffNitro())
}; // Stats.js
// //jshint asi: true
// //# sourceURL=Stats.js
// var Stats = {
//     _options: null,
//     _stats: null,
//     _initialized: false,
//     getStats : function(app) {
//         if (this._initialized) return this._stats

//         this._options = pcx.MiniStats.getDefaultOptions()
//         this._options.sizes = [
//             { width: 128, height: 16, spacing: 0, graphs: false },
//             { width: 256, height: 32, spacing: 2, graphs: true },
//             { width: 500, height: 64, spacing: 2, graphs: true }
//         ];

//         // when the application starts, use the largest size
//         this._options.startSizeIndex = 0;

//         // display additional counters
//         // Note: for most of thees to report values, either debug or profiling engine build needs to be used.
//         this._options.stats = [

//             // frame update time in ms
//             {
//                 name: "Update",
//                 stats: ["frame.updateTime"],
//                 decimalPlaces: 1,
//                 unitsName: "ms",
//                 watermark: 33
//             },

//             // total number of draw calls
//             {
//                 name: "DrawCalls",
//                 stats: ["drawCalls.total"],
//                 watermark: 2000
//             },

//             // total number of triangles, in 1000s
//             {
//                 name: "triCount",
//                 stats: ["frame.triangles"],
//                 decimalPlaces: 1,
//                 multiplier: 1 / 1000,
//                 unitsName: "k",
//                 watermark: 500
//             },

//             // number of materials used in a frame
//             {
//                 name: "materials",
//                 stats: ["frame.materials"],
//                 watermark: 2000
//             },

//             // frame time it took to do frustum culling
//             {
//                 name: "cull",
//                 stats: ["frame.cullTime"],
//                 decimalPlaces: 1,
//                 watermark: 1,
//                 unitsName: "ms",
//             },

//             // used VRAM, displayed using 2 colors - red for textures, green for geometry
//             {
//                 name: "VRAM",
//                 stats: ["vram.tex", "vram.geom"],
//                 decimalPlaces: 1,
//                 multiplier: 1 / (1024 * 1024),
//                 unitsName: "MB",
//                 watermark: 100
//             },

//             // frames per second
//             {
//                 name: "FPS",
//                 stats: ["frame.fps"],
//                 watermark: 60
//             },

//             // delta time
//             {
//                 name: "Frame",
//                 stats: ["frame.ms"],
//                 decimalPlaces: 1,
//                 unitsName: "ms",
//                 watermark: 33
//             }
//         ];

//         this._stats = new pcx.MiniStats(app, this._options)
//         this._initialized = true
//         return this._stats
//     }
// }

var GridCell = function() {
        this.obstacle = [], this.hulls = [], this.spears = [], this.projectiles = [], this.triggers = [], this.pickups = {}
    },
    AABB = function(i, t, s, e) {
        this._pos = new pc.Vec2(i, t), this._size = new pc.Vec2(s, e), this.leftTop = new pc.Vec2(0, 0), this.leftBottom = new pc.Vec2(0, 0), this.rightTop = new pc.Vec2(0, 0), this.rightBottom = new pc.Vec2(0, 0), this.corners = [this.leftTop, this.leftBottom, this.rightTop, this.rightBottom], Object.defineProperty(this, "position", {
            get: function() {
                return this._pos
            },
            set: function(i, t) {
                this._pos.set(i, t), this.recalculate()
            }
        }), Object.defineProperty(this, "size", {
            get: function() {
                return this._size
            },
            set: function(i, t) {
                this._size.set(i, t), this.recalculate()
            }
        }), this.updateAABB = function(i, t, s, e) {
            this._pos.set(i, t), this._size.set(i, t), this.recalculate()
        }, this.recalculate = function() {
            this.left = this._pos.x - size.x / 2, this.right = this._pos.x + size.x / 2, this.top = this._pos.y + size.y / 2, this.bottom = this._pos.y - size.y / 2, this.leftTop.set(this.left, this.top), this.leftBottom.set(this.left, this.bottom), this.rightTop.set(this.right, this.top), this.rightBottom.set(this.right, this.bottom)
        }, this.recalculate()
    },
    Grid = function(i, t, s, e) {
        this._staticCollision = null, this._grid = [], this._indexes = [], this._pos = new pc.Vec3, this._bounds = new pc.Vec2, this._hulls = {}, this._spears = {}, this._projectiles = {}, this._triggers = {}, this.size = i * t, this.width = s, this.height = e, this.cellSize = new pc.Vec2(s / i, e / t);
        for (var h = 0; h < i; h++)
            for (var o = 0; o < t; o++) this._grid.push(new GridCell);
        this.clear = function() {
            this._grid.splice(0), this._indexes.splice(0), this._hulls = null, this._spears = null, this._projectiles = null, this._triggers = null
        }, this.positionToSpatial = function(s, e) {
            var h = Math.floor(s / this.cellSize.x),
                o = Math.floor(e / this.cellSize.y);
            return h >= i || h < 0 || o >= t || o < 0 ? -1 : o * i + h
        }, this.positionToSpatialBounds = function(s, e) {
            var h = Math.floor(s / this.cellSize.x),
                o = Math.floor(e / this.cellSize.y);
            return this._bounds.set(1, 1), h >= i && (this._bounds.x = -1), h < 0 && (this._bounds.x = -1), o >= t && (this._bounds.y = -1), o < 0 && (this._bounds.y = -1), this._bounds
        }, this.spatialToPosition = function(t) {
            var s = t % i,
                e = Math.floor(t / i);
            return this._pos.set(s * this.cellSize.x + this.cellSize.x / 2, 0, e * this.cellSize.y + this.cellSize.y / 2), this._pos
        }, this.spatialXYToPosition = function(i, t) {
            return this._pos.set(i * this.cellSize.x + this.cellSize.x / 2, 0, t * this.cellSize.y + this.cellSize.y / 2), this._pos
        }, this.aabbToSpatial = function(i) {
            this._indexes.splice(0);
            for (var t = 0; t < i.corners.length; t++) {
                var s = i.corners[t],
                    e = this.positionToSpatial(s.x, s.y); - 1 === this._indexes.indexOf(e) && this._indexes.push(e)
            }
            return this._indexes
        }, this.circleToSpatial = function(i) {
            this._indexes.splice(0);
            for (var t = i.getCorners(), s = 0; s < t.length; s++) {
                var e = t[s],
                    h = this.positionToSpatial(e.x, e.y); - 1 === this._indexes.indexOf(h) && this._indexes.push(h)
            }
            return this._indexes
        }, this.getCell = function(i) {
            return this._grid[i]
        }, this.attachHull = function(i) {
            this._hulls[i.script.actor.id] = i
        }, this.removeHull = function(i) {
            delete this._hulls[i]
        }, this.attachSpear = function(i) {
            this._spears[i.script.actor.id] = i
        }, this.removeSpear = function(i) {
            delete this._spears[i]
        }, this.attachProjectile = function(i) {
            this._projectiles[i.script.actor.id] = i
        }, this.removeProjectile = function(i) {
            delete this._projectiles[i]
        }, this.attachTrigger = function(i) {
            this._triggers[i.script.actor.id] = i
        }, this.removeTrigger = function(i) {
            delete this._triggers[i]
        }, this.attachPickup = function(i) {
            var t = i.getPosition(),
                s = this.positionToSpatial(t.x, t.z); - 1 !== s && (this._grid[s].pickups[i.script.actor.id] = i)
        }, this.removePickup = function(i) {
            var t = i.getPosition(),
                s = this.positionToSpatial(t.x, t.z); - 1 !== s && (this._grid[s].pickups[i.script.actor.id] ? delete this._grid[s].pickups[i.script.actor.id] : console.warn("there is no pickup here"))
        }, this.solveSpatial = function() {
            var i, t = 0;
            for (t = 0; t < this._grid.length; t++) this._grid[t].hulls.splice(0), this._grid[t].spears.splice(0), this._grid[t].projectiles.splice(0), this._grid[t].triggers.splice(0);
            var s, e, h = [];
            for (i in this._hulls) {
                var o = this._hulls[i].script.aabb;
                for (o.initialize(), s = this.aabbToSpatial(o), o.entity.script.player._state === PlayerState.RIDING && (o.entity.script.player.hyper = s.indexOf(-1) > -1), e = 0; e < s.length; e++)
                    if (-1 !== s[e]) try {
                        this._grid[s[e]].hulls.push(o.entity)
                    } catch (i) {
                        console.error(s)
                    }
            }
            for (i in this._spears) {
                var r = this._spears[i].script.spear.getLine(),
                    l = this.positionToSpatial(r[0].x, r[0].y),
                    n = this.positionToSpatial(r[1].x, r[1].y); - 1 === l && -1 === n || (l === n ? this._grid[l].spears.push(this._spears[i]) : (l >= 0 && this._grid[l].spears.push(this._spears[i]), n >= 0 && this._grid[n].spears.push(this._spears[i])))
            }
            for (i in this._projectiles) {
                var c = this._projectiles[i],
                    p = c.getPosition(),
                    a = this.positionToSpatial(p.x, p.z);
                a < 0 || this._grid[a].projectiles.push(c)
            }
            for (i in this._triggers) {
                var u = this._triggers[i].script.colliderCircle;
                for (s = this.circleToSpatial(u), e = 0; e < s.length; e++) - 1 !== s[e] && this._grid[s[e]].triggers.push(u.entity)
            }
            for (t = 0; t < h.length; t++) {
                var _ = h[t].getPosition();
                console.log(h[t].script.actor.id, "static destroy hull: ", h[t], "spatial: ", this.spatialXYToPosition(_.x, _.z)), h[t].fire("collision", this._staticCollision)
            }
        }, this.solveCollisions = function() {}
    };
var Aabb = pc.createScript("aabb");
Aabb.attributes.add("recalculateOnUpdate", {
    type: "boolean"
}), Aabb.attributes.add("collider", {
    type: "string"
}), Aabb.attributes.add("gizmoColor", {
    type: "rgb"
}), Aabb.prototype.initialize = function() {
    this._inited || (this._inited = !0, this._pos = new pc.Vec2(0, 0), this._size = new pc.Vec2(0, 0), this.leftTop = new pc.Vec2(0, 0), this.leftBottom = new pc.Vec2(0, 0), this.rightTop = new pc.Vec2(0, 0), this.rightBottom = new pc.Vec2(0, 0), this.corners = [this.leftTop, this.leftBottom, this.rightBottom, this.rightTop], this.recalculate())
}, Aabb.prototype.setPosition = function(t, i) {
    this._pos.set(t, i), this.recalculate()
}, Aabb.prototype.setSize = function(t, i) {
    this._size.set(t, i), this.recalculate()
}, Aabb.prototype.updateAABB = function(t, i, e, s) {
    this._pos.set(t, i), this._size.set(e, s), this.recalculate()
}, Aabb.prototype.recalculate = function() {
    this.left = this._pos.x - this._size.x / 2, this.right = this._pos.x + this._size.x / 2, this.top = this._pos.y + this._size.y / 2, this.bottom = this._pos.y - this._size.y / 2, this.leftTop.set(this.left, this.top), this.leftBottom.set(this.left, this.bottom), this.rightTop.set(this.right, this.top), this.rightBottom.set(this.right, this.bottom)
}, Aabb.prototype.updateFromEntity = function() {
    this.initialize();
    for (var t = this.entity.script[this.collider].points, i = Number.POSITIVE_INFINITY, e = Number.NEGATIVE_INFINITY, s = Number.NEGATIVE_INFINITY, o = Number.POSITIVE_INFINITY, h = 0; h < t.length; h++) {
        var p = t[h].getPosition();
        p.x < i && (i = p.x), p.x > e && (e = p.x), p.z < o && (o = p.z), p.z > s && (s = p.z)
    }
    this.updateAABB(i + (e - i) / 2, o + (s - o) / 2, e - i, s - o)
}, Aabb.prototype.update = function(t) {
    this.recalculateOnUpdate && this.updateFromEntity(), Gizmo.polygon2(this.corners, this.gizmoColor)
};
var Pool = pc.createScript("pool");
Pool.attributes.add("prefabs", {
    type: "asset",
    array: !0
}), Pool.attributes.add("prewarm", {
    type: "number",
    array: !0
}), Pool.prototype.initialize = function() {
    for (var t in this._items = {}, this._prefabDict = {}, this._skins = [], Helper.playerE.script.skinComponent.__attributes) this._skins.push(t);
    for (var e = 0; e < this.prefabs.length; e++) {
        for (var i = this.prefabs[e], s = [], r = 0; r < this.prewarm[e]; r++) s.push(this._createInstance(i));
        this._items[i.name] = s, this._prefabDict[i.name] = i
    }
}, Pool.prototype._createInstance = function(t) {
    var e = t.resource.instantiate();
    return this.app.root.addChild(e), e.script.skinComponent && e.script.skinComponent.setSkin(this._skins[Math.floor(pc.math.random(0, this._skins.length))]), e.enabled = !1, e
}, Pool.prototype.spawn = function(t, ...e) {
    var i = null;
    return (i = this._items[t].length > 0 ? this._items[t].splice(0, 1)[0] : this._createInstance(this._prefabDict[t])).enabled = !0, i.script.poolItem.spawn.apply(i.script.poolItem, e), i
}, Pool.prototype.put = function(t) {
    t.entity.enabled = !1, this._items[t.itemId].push(t.entity)
}, Pool.prototype.update = function(t) {};
var PoolItem = pc.createScript("poolItem");
PoolItem.attributes.add("itemId", {
    type: "string"
}), PoolItem.attributes.add("useAutoReturn", {
    type: "boolean"
}), PoolItem.attributes.add("autoReturnTimer", {
    type: "number"
}), PoolItem.attributes.add("playFXOnSpawn", {
    type: "boolean"
}), PoolItem.prototype.spawn = function(t, ...e) {
    this.present = !0, this.entity.setPosition(t.x, t.y, t.z), this.time = this.autoReturnTimer, this.playFXOnSpawn && (this.entity.particlesystem.reset(), this.entity.particlesystem.play()), this.entity.fire("pool_spawn", ...e)
}, PoolItem.prototype.despawn = function() {
    this.present = !1, this.entity.fire("pool_despawn"), Helper.pool.put(this)
}, PoolItem.prototype.update = function(t) {
    this.present, this.useAutoReturn && (Helper.reloading || (t *= Helper.game.timeScale, this.time -= t, this.time <= 0 && this.despawn()))
};
var ShaderShield = pc.createScript("shaderShield");
ShaderShield.attributes.add("vs", {
    type: "asset",
    assetType: "shader",
    title: "Vertex Shader"
}), ShaderShield.attributes.add("fs", {
    type: "asset",
    assetType: "shader",
    title: "Fragment Shader"
}), ShaderShield.attributes.add("blendMode", {
    type: "number",
    enum: [{
        additive: 1
    }, {
        normal: 2
    }, {
        mult: 5
    }, {
        additive_alpha: 6
    }]
}), ShaderShield.attributes.add("heightMap", {
    type: "asset"
}), ShaderShield.attributes.add("color", {
    type: "rgb",
    title: "Base Color"
}), ShaderShield.attributes.add("color2", {
    type: "rgb",
    title: "Hyperspace Color"
}), ShaderShield.attributes.add("multiply", {
    type: "number"
}), ShaderShield.attributes.add("alphaMultiplier", {
    type: "number",
    title: "Alpha mult"
}), ShaderShield.attributes.add("frensel_dot_mult", {
    type: "number",
    title: "frensel dot mult"
}), ShaderShield.attributes.add("frensel_power", {
    type: "vec2",
    title: "frensel exponent"
}), ShaderShield.attributes.add("frensel_power_speed", {
    type: "number",
    title: "blinking speed"
}), ShaderShield.attributes.add("static_view_dir", {
    type: "vec3",
    title: "frensel viewdir"
}), ShaderShield.prototype.getShaderInstance = function() {
    if (this._cached) return {
        material: this._cached,
        appearTime: 0,
        time: 0,
        blinkingSpeed: this.frensel_power_speed,
        injectMeshInsance: function(e) {
            this.meshInstances = e
        },
        update: function() {
            for (var e in this.meshInstances) this.meshInstances[e].setParameter("appearTime", this.appearTime), this.meshInstances[e].setParameter("uTime", this.time)
        }
    };
    var e = Helper.createMaterial(this.vs, this.fs, "ShaderShield");
    return e.depthTest = !1, e.blendType = this.blendMode, e.setParameter("uHeightMap", this.heightMap.resource), e.setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), e.setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), e.setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), e.setParameter("multiply", this.multiply), e.setParameter("alphaMultiplier", this.alphaMultiplier), e.setParameter("frensel_dot_mult", this.frensel_dot_mult), e.setParameter("frensel_power", [this.frensel_power.x, this.frensel_power.y]), e.setParameter("static_view_dir", [this.static_view_dir.x, this.static_view_dir.y, this.static_view_dir.z]), this._cached = e, this.getShaderInstance()
}, ShaderShield.prototype.initShader = function() {
    if (!0 !== this.shaderInited) {
        this.time = 0, this.shaderInited = !0;
        var e = this.app.graphicsDevice,
            t = this.vs.resource,
            r = "precision " + e.precision + " float;\n";
        r += this.fs.resource;
        var i = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION,
                aColor: pc.SEMANTIC_COLOR,
                aNormal: pc.SEMANTIC_NORMAL,
                aUv0: pc.SEMANTIC_TEXCOORD0
            },
            vshader: t,
            fshader: r
        };
        this.shader = new pc.Shader(e, i), this.material = Helper.createMaterial(this.vs, this.fs, "ShaderShield"), this.material.depthTest = !1, this.material.blendType = this.blendMode, this.material.setParameter("uHeightMap", this.heightMap.resource), this.material.setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), this.material.setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), this.material.setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), this.material.setParameter("multiply", this.multiply), this.material.setParameter("alphaMultiplier", this.alphaMultiplier), this.material.setParameter("frensel_dot_mult", this.frensel_dot_mult), this.material.setParameter("frensel_power", [this.frensel_power.x, this.frensel_power.y]), this.material.setParameter("static_view_dir", [this.static_view_dir.x, this.static_view_dir.y, this.static_view_dir.z])
    }
}, ShaderShield.prototype.update = function(e) {
    if (this.shaderInited) {
        this.time += e * Helper.game.timeScale * this.frensel_power_speed;
        var t = this.time % 2;
        t > 1 && (t = 1 - (t - 1))
    }
};
var CustomShader = pc.createScript("customShader");
CustomShader.attributes.add("shaderName", {
    type: "string"
}), CustomShader.prototype.initialize = function() {
    Helper.getShader(this.shaderName).initShader(), this.material = Helper.getShader(this.shaderName).material, this.entity.model.model.meshInstances[0].material = this.material
};
var Tween = pc.createScript("tween");
Tween.attributes.add("positionTween", {
    type: "boolean"
}), Tween.attributes.add("positionLocal", {
    type: "boolean"
}), Tween.attributes.add("positionFrom", {
    type: "vec3"
}), Tween.attributes.add("positionTo", {
    type: "vec3"
}), Tween.attributes.add("positionDuration", {
    type: "number"
}), Tween.attributes.add("positionEasing", {
    type: "string"
}), Tween.attributes.add("opacityTween", {
    type: "boolean"
}), Tween.attributes.add("opacityFrom", {
    type: "number"
}), Tween.attributes.add("opacityTo", {
    type: "number"
}), Tween.attributes.add("opacityDuration", {
    type: "number"
}), Tween.attributes.add("opacityEasing", {
    type: "string"
}), Tween.attributes.add("scaleTween", {
    type: "boolean"
}), Tween.attributes.add("scaleFrom", {
    type: "vec3"
}), Tween.attributes.add("scaleTo", {
    type: "vec3"
}), Tween.attributes.add("scaleDuration", {
    type: "number"
}), Tween.attributes.add("scaleEasing", {
    type: "string"
}), Tween.prototype.initialize = function() {
    this.lastPlay = "reverse", this._positionTweener = null, this._positionValue = {
        x: 0,
        y: 0,
        z: 0
    }, this._positionFromArgs = {
        x: 0,
        y: 0,
        z: 0
    }, this._positionToArgs = {
        x: 0,
        y: 0,
        z: 0,
        duration: this.positionDuration,
        ease: this.positionEasing,
        onComplete: function() {
            this._positionTweener = null
        }.bind(this)
    }, this._positionReverseFromArgs = {
        x: 0,
        y: 0,
        z: 0
    }, this._positionReverseToArgs = {
        x: 0,
        y: 0,
        z: 0,
        duration: this.positionDuration,
        ease: this.positionEasing,
        onComplete: function() {
            this._positionTweener = null
        }.bind(this)
    }, this._scaleTweener = null, this._scaleValue = {
        x: 0,
        y: 0,
        z: 0
    }, this._scaleFromArgs = {
        x: 0,
        y: 0,
        z: 0
    }, this._scaleToArgs = {
        x: 0,
        y: 0,
        z: 0,
        duration: this.scaleDuration,
        ease: this.scaleEasing,
        onComplete: function() {
            this._scaleTweener = null
        }.bind(this)
    }, this._scaleFromReverseArgs = {
        x: 0,
        y: 0,
        z: 0
    }, this._scaleToReverseArgs = {
        x: 0,
        y: 0,
        z: 0,
        duration: this.scaleDuration,
        ease: this.scaleEasing,
        onComplete: function() {
            this._scaleTweener = null
        }.bind(this)
    }, this._opacityTweener = null, this._opacityFromArgs = {
        opacity: 0
    }, this._opacityToArgs = {
        opacity: 0,
        duration: this.opacityDuration,
        ease: this.opacityEasing,
        onComplete: function() {
            this._opacityTweener = null
        }.bind(this)
    }
}, Tween.prototype._positionSetValues = function() {
    this._positionTweener && (console.warn("position tweener was force restarted"), this._positionTweener.kill(), this._positionTweener = null), this._positionFromArgs.x = this.positionFrom.x, this._positionFromArgs.y = this.positionFrom.y, this._positionFromArgs.z = this.positionFrom.z, this._positionReverseFromArgs.x = this.positionTo.x, this._positionReverseFromArgs.y = this.positionTo.y, this._positionReverseFromArgs.z = this.positionTo.z, this._positionToArgs.x = this.positionTo.x, this._positionToArgs.y = this.positionTo.y, this._positionToArgs.z = this.positionTo.z, this._positionReverseToArgs.x = this.positionFrom.x, this._positionReverseToArgs.y = this.positionFrom.y, this._positionReverseToArgs.z = this.positionFrom.z, this._positionToArgs.duration = this.positionDuration, this._positionReverseToArgs.duration = this.positionDuration
}, Tween.prototype._scaleSetValues = function() {
    this._scaleTweener && (this._scaleTweener.kill(), this._scaleTweener = null), this._scaleFromArgs.x = this.scaleFrom.x, this._scaleFromArgs.y = this.scaleFrom.y, this._scaleFromArgs.z = this.scaleFrom.z, this._scaleFromReverseArgs.x = this.scaleTo.x, this._scaleFromReverseArgs.y = this.scaleTo.y, this._scaleFromReverseArgs.z = this.scaleTo.z, this._scaleToArgs.x = this.scaleTo.x, this._scaleToArgs.y = this.scaleTo.y, this._scaleToArgs.z = this.scaleTo.z, this._scaleToReverseArgs.x = this.scaleFrom.x, this._scaleToReverseArgs.y = this.scaleFrom.y, this._scaleToReverseArgs.z = this.scaleFrom.z, this._scaleToArgs.duration = this.positionDuration, this._scaleToReverseArgs.duration = this.positionDuration
}, Tween.prototype._opacitySetValues = function() {
    this._opacityTweener && (this._opacityTweener.kill(), this._opacityTweener = null), this._opacityFromArgs.opacity = this.opacityFrom, this._opacityToArgs.opacity = this.opacityTo, this._opacityToArgs.duration = this.opacityDuration
}, Tween.prototype.play = function() {
    "forward" !== this.lastPlay && (this.lastPlay = "forward", this.positionTween && (this._positionSetValues(), this._positionTweener = gsap.fromTo(this._positionValue, this.positionDuration, this._positionFromArgs, this._positionToArgs)), this.opacityTween && (this._opacitySetValues(), this._opacityTweener = gsap.fromTo(this.entity.element, this.opacityDuration, this._opacityFromArgs, this._opacityToArgs)), this.scaleTween && (this._scaleSetValues(), this._scaleTweener = gsap.fromTo(this._scaleValue, this.scaleDuration, this._scaleFromArgs, this._scaleToArgs)))
}, Tween.prototype.playReverse = function() {
    "reverse" !== this.lastPlay && (this.lastPlay = "reverse", this.positionTween && (this._positionSetValues(), this._positionTweener = gsap.fromTo(this._positionValue, this.positionDuration, this._positionReverseFromArgs, this._positionReverseToArgs)), this.opacityTween && (this._opacitySetValues(), this._opacityTweener = gsap.fromTo(this.entity.element, this.opacityDuration, this._opacityToArgs, this._opacityFromArgs)), this.scaleTween && (this._scaleSetValues(), this._scaleTweener = gsap.fromTo(this._scaleValue, this.scaleDuration, this._scaleFromReverseArgs, this._scaleToReverseArgs)))
}, Tween.prototype.update = function(s) {
    null !== this._positionTweener && (this.positionLocal ? this.entity.setLocalPosition(this._positionValue.x, this._positionValue.y, this._positionValue.z) : this.entity.setPosition(this._positionValue.x, this._positionValue.y, this._positionValue.z)), null !== this._scaleTweener && this.entity.setLocalScale(this._scaleValue.x, this._scaleValue.y, this._scaleValue.z)
};
var ShaderMatcap = pc.createScript("shaderMatcap");
ShaderMatcap.attributes.add("vs", {
    type: "asset",
    assetType: "shader",
    title: "Vertex Shader"
}), ShaderMatcap.attributes.add("fs", {
    type: "asset",
    assetType: "shader",
    title: "Fragment Shader"
}), ShaderMatcap.attributes.add("texture", {
    type: "asset"
}), ShaderMatcap.attributes.add("mask", {
    type: "asset"
}), ShaderMatcap.attributes.add("colorTexture", {
    type: "asset"
}), ShaderMatcap.attributes.add("dissolveMask", {
    type: "asset"
}), ShaderMatcap.attributes.add("palette", {
    type: "asset"
}), ShaderMatcap.attributes.add("tint", {
    type: "rgb",
    title: "Tint Color"
}), ShaderMatcap.attributes.add("ambient", {
    type: "rgb",
    title: "Ambient Color"
}), ShaderMatcap.attributes.add("emissive", {
    type: "number",
    title: "Emissive component"
}), ShaderMatcap.prototype.getShaderInstance = function() {
    var e = this.tint,
        t = this.emissive;
    if (this._cached) return {
        tint: e,
        paletteSample: [.1, .5],
        material: this._cached,
        time: 0,
        dissolve: 0,
        meshInstances: null,
        injectMeshInsance: function(e) {
            this.meshInstances = e
        },
        update: function() {
            var e = new pc.Vec3,
                s = Helper.game.lightSource.getRotation();
            for (var a in s.transformVector(pc.Vec3.UP, e), this.meshInstances) this.meshInstances[a].setParameter("uLightPos", [e.x, e.y, e.z]), this.meshInstances[a].setParameter("uTint", [this.tint.r, this.tint.g, this.tint.b]), this.meshInstances[a].setParameter("uTime", this.time), this.meshInstances[a].setParameter("uDissolve", this.dissolve), this.meshInstances[a].setParameter("uPaletteSample", this.paletteSample), this.meshInstances[a].setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), this.meshInstances[a].setParameter("uEmissive", t)
        }
    };
    var s = Helper.createMaterial(this.vs, this.fs, "ShaderMatcap");
    s.alphaWrite = !1, s.depthTest = !0, s.setParameter("uDiffuseMap", this.texture.resource), s.setParameter("uMask", this.mask.resource), s.setParameter("uColorTexture", this.colorTexture.resource), s.setParameter("uDissolveMask", this.dissolveMask.resource), s.setParameter("uPalette", this.palette.resource), s.setParameter("uTint", [this.tint.r, this.tint.g, this.tint.b]), s.setParameter("uAmbientLight", [this.ambient.r, this.ambient.g, this.ambient.b]), s.setParameter("uPaletteSample", [.1, .5]), s.setParameter("uEmissive", t);
    var a = {
        tint: e,
        paletteSample: [.1, .5],
        material: s,
        time: 0,
        dissolve: 0,
        meshInstances: null,
        injectMeshInsance: function(e) {
            this.meshInstances = e
        },
        update: function() {
            var e = new pc.Vec3,
                s = Helper.game.lightSource.getRotation();
            for (var a in s.transformVector(pc.Vec3.UP, e), this.meshInstances) this.meshInstances[a].setParameter("uLightPos", [e.x, e.y, e.z]), this.meshInstances[a].setParameter("uTint", [this.tint.r, this.tint.g, this.tint.b]), this.meshInstances[a].setParameter("uTime", this.time), this.meshInstances[a].setParameter("uDissolve", this.dissolve), this.meshInstances[a].setParameter("uPaletteSample", this.paletteSample), this.meshInstances[a].setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), this.meshInstances[a].setParameter("uEmissive", t)
        }
    };
    return this._cached = s, a
}, ShaderMatcap.prototype.initShader = function() {
    if (!0 !== this.shaderInited) {
        this.time = 0, this.shaderInited = !0;
        var e = this.app.graphicsDevice,
            t = this.vs.resource,
            s = "precision " + e.precision + " float;\n";
        s += this.fs.resource;
        var a = {
            attributes: {
                vVertex: pc.SEMANTIC_POSITION,
                vNormal: pc.SEMANTIC_NORMAL,
                vTexCoord: pc.SEMANTIC_TEXCOORD0
            },
            vshader: t,
            fshader: s
        };
        this.shader = new pc.Shader(e, a), this.material = new pc.Material, this.material.name = "ShaderMatcap", this.material.shader = this.shader, this.material.alphaWrite = !1, this.material.depthTest = !0, this.material.setParameter("uDiffuseMap", this.texture.resource), this.material.setParameter("uMask", this.mask.resource), this.material.setParameter("uColorTexture", this.colorTexture.resource), this.material.setParameter("uDissolveMask", this.dissolveMask.resource), this.material.setParameter("uPalette", this.palette.resource), this.material.setParameter("uTint", [this.tint.r, this.tint.g, this.tint.b]), this.material.setParameter("uAmbientLight", [this.ambient.r, this.ambient.g, this.ambient.b]), this.material.setParameter("uEmissive", this.emissive), this.time = 0, this.dissolve = 0
    }
}, ShaderMatcap.prototype.update = function(e) {
    if (this._cached) {
        var t = this._cached;
        if (Helper.params.realDebug) {
            t.setParameter("uDiffuseMap", this.texture.resource), t.setParameter("uMask", this.mask.resource), t.setParameter("uColorTexture", this.colorTexture.resource), t.setParameter("uDissolveMask", this.dissolveMask.resource), t.setParameter("uPalette", this.palette.resource), t.setParameter("uTint", [this.tint.r, this.tint.g, this.tint.b]);
            var s = new pc.Vec3;
            Helper.game.lightSource.getRotation().transformVector(pc.Vec3.UP, s), t.setParameter("uLightPos", [s.x, s.y, s.z]);
            Helper.game.lightSource.light.color;
            t.setParameter("uAmbientLight", [this.ambient.r, this.ambient.g, this.ambient.b, 1]), t.setParameter("uTime", this.time), t.setParameter("uDissolve", this.dissolve), t.setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), t.setParameter("uEmissive", this.emissive)
        }
    }
};
var Trail = pc.createScript("trail");
Trail.attributes.add("frames", {
    type: "number"
}), Trail.attributes.add("frameSize", {
    type: "number"
}), Trail.attributes.add("width", {
    type: "number"
}), Trail.attributes.add("ease", {
    type: "string"
}), Trail.attributes.add("scale", {
    type: "number"
}), Trail.attributes.add("waveSpeed", {
    type: "number"
}), Trail.attributes.add("localParent", {
    type: "entity"
}), Trail.prototype.initialize = function() {
    var s = 3 * (2 + 2 * this.frames);
    this.positions = new Float32Array(s), this.indices = [], this.frameIndex = 0, this.currentFrames = [], this.offset = 1, this.normal0 = new pc.Vec2, this.normal1 = new pc.Vec2;
    for (; t < s; t++) this.positions[t] = 0;
    for (var t = 2; t <= s / 3; t += 2) this.indices.push(t - 2), this.indices.push(t - 1), this.indices.push(t), this.indices.push(t), this.indices.push(t - 1), this.indices.push(t + 1);
    this.mesh = new pc.Mesh(this.app.graphicsDevice), this.mesh.clear(!0, !1), this.updateMesh(!0), this.node = new pc.GraphNode;
    var e = Helper.getShader("shaderTrail");
    e.initialize(), this.meshInstance = new pc.MeshInstance(this.node, this.mesh, e.material), this.model = new pc.Model, this.model.graph = this.node, this.model.meshInstances = [this.meshInstance], this.app.systems.model.addComponent(this.entity, {
        type: "asset"
    }), this.entity.model.model = this.model, this.entity.model.castShadows = !1, this.entity.model.receiveShadows = !1, this.worldToLocal = new pc.Mat4, this.time = 0
}, Trail.prototype.updateMesh = function(s) {
    this.mesh.setPositions(this.positions, 3, this.positions.length), s && this.mesh.setIndices(this.indices), this.mesh.update(pc.PRIMITIVE_TRIANGLES)
}, Trail.prototype.update2 = function(s) {
    this.time += s, this.worldToLocal.copy(this.entity.getWorldTransform()), this.worldToLocal.invert();
    var t, e, i, r, a, h = this.entity.getPosition(),
        n = this.currentFrames.length,
        o = 0;
    if (0 === n) {
        var l = new pc.Vec3(h.x, h.y, h.z);
        this.currentFrames.push(l)
    } else {
        var c, m = this.currentFrames[this.currentFrames.length - 1],
            p = h.distance(m);
        if (p >= this.frameSize * this.scale)(c = n >= this.frames ? this.currentFrames.splice(0, 1)[0] : new pc.Vec3).set(h.x, h.y, h.z), this.currentFrames.push(c), o = 0;
        else o = p / this.frameSize * this.scale
    }
    n = this.currentFrames.length;
    for (var d = 0; d < this.currentFrames.length; d++) {
        var u = this.currentFrames[d];
        Gizmo.circle(u, .1, 3, Gizmo.RED_GIZMO)
    }
    if (this.currentFrames.length === this.frames) {
        var f = (new pc.Vec3).lerp(this.currentFrames[0], this.currentFrames[1], o);
        this.setPoints(0, this.worldToLocal.transformPoint(f))
    } else this.setPoints(0, this.worldToLocal.transformPoint(this.currentFrames[0]));
    for (var T = 1; T < n; T++) t = this.worldToLocal.transformPoint(this.currentFrames[T - 1]), i = (e = this.worldToLocal.transformPoint(this.currentFrames[T])).x - t.x, r = e.z - t.z, a = n < this.frames ? T / this.frames : T / this.frames - 1 / this.frames * o, scalingTEase = Helper.ease[this.ease](a), this.normal0.set(-r, i).normalize().scale(scalingTEase * this.width), this.normal1.set(r, -i).normalize().scale(scalingTEase * this.width), this.setPoints(6 * T, e, this.normal0, this.normal1);
    1 === n && (t = this.worldToLocal.transformPoint(this.currentFrames[0]), i = (e = this.worldToLocal.transformPoint(h)).x - t.x, r = e.z - t.z, a = 1 / this.frames, scalingTEase = Helper.ease[this.ease](a), this.normal0.set(-r, i).normalize().scale(scalingTEase * this.width), this.normal1.set(r, -i).normalize().scale(scalingTEase * this.width), this.setPoints(6, e, this.normal0, this.normal1)), t = this.worldToLocal.transformPoint(this.currentFrames[n - 1]);
    for (var w = n + 1; w <= this.frames; w++) i = (e = this.worldToLocal.transformPoint(h)).x - t.x, r = e.z - t.z, a = w / this.frames, scalingTEase = Helper.ease[this.ease](a), this.normal0.set(-r, i).normalize().scale(scalingTEase * this.width), this.normal1.set(r, -i).normalize().scale(scalingTEase * this.width), this.setPoints(6 * w, e, this.normal0, this.normal1);
    this.updateMesh(!1)
}, Trail.prototype.setPoints = function(s, t, e, i) {
    this.positions[s] = t.x + (e ? e.x : 0), this.positions[s + 1] = t.y, this.positions[s + 2] = t.z + (e ? e.y : 0), this.positions[s + 3] = t.x + (i ? i.x : 0), this.positions[s + 4] = t.y, this.positions[s + 5] = t.z + (i ? i.y : 0)
}, Trail.prototype.update = function(s) {
    if (0 !== Helper.game.timeScale) return this.localParent, this.update2(s * Helper.game.timeScale)
};
var ShaderTrail = pc.createScript("shaderTrail");
ShaderTrail.attributes.add("vs", {
    type: "asset",
    assetType: "shader",
    title: "Vertex Shader"
}), ShaderTrail.attributes.add("fs", {
    type: "asset",
    assetType: "shader",
    title: "Fragment Shader"
}), ShaderTrail.attributes.add("color", {
    type: "rgb"
}), ShaderTrail.attributes.add("hyperColor", {
    type: "rgb"
}), ShaderTrail.prototype.initialize = function() {
    if (!0 !== this.shaderInited) {
        this.time = 0, this.shaderInited = !0;
        var e = this.app.graphicsDevice,
            r = this.vs.resource,
            t = "precision " + e.precision + " float;\n";
        t += this.fs.resource;
        var a = {
            attributes: {
                vVertex: pc.SEMANTIC_POSITION,
                vNormal: pc.SEMANTIC_NORMAL,
                vTexCoord: pc.SEMANTIC_TEXCOORD0
            },
            vshader: r,
            fshader: t
        };
        this.shader = new pc.Shader(e, a), this.material = new pc.Material, this.material.name = "ShaderTrail", this.material.shader = this.shader, this.material.chunks = {}, this.material.alphaWrite = !1, this.material.depthTest = !0, this.material.cull = pc.CULLFACE_NONE, this.material.setParameter("uColor", [this.color.r, this.color.g, this.color.b]), this.material.setParameter("uHyperColor", [this.hyperColor.r, this.hyperColor.g, this.hyperColor.b])
    }
}, ShaderTrail.prototype.update = function(e) {
    this.shaderInited && (this.material.setParameter("uColor", [this.color.r, this.color.g, this.color.b]), this.material.setParameter("uHyperColor", [this.hyperColor.r, this.hyperColor.g, this.hyperColor.b]), this.material.setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), this.material.update())
};
var SAVE_KEY = "nitro-nights-rnd",
    Inventory = {
        ftue0: !0,
        ftue1: !0,
        ftue2: !0,
        ftue_controls: 0,
        ftue_coins: 0,
        ftue_frags: 0,
        ftue_king: 0,
        ftue_hyper: 0,
        ftue_death_general: 0,
        ftue_death_ram: 0,
        ftue_death_spear: 0,
        ftue_death_hyper: 0,
        ftue_pickup_nitro: 0,
        ftue_pickup_shield: 0,
        ftue_pickup_enlarger: 0,
        ftue_pickup_smoke: 0,
        ftue_pickup_shooter: 0,
        ftue_pickup_sphere: 0,
        coins: 0,
        frags: 0,
        level: 0,
        pickups: ["pickup_coin"],
        hovers: ["hover_catfish"],
        hover_catfish: [0],
        selectedHover: "hover_catfish",
        selectedColor: 0,
        nextUnlockProgress: 0,
        lastLevelLost: !1,
        sound: !0,
        load: function() {
            var e = localStorage.getItem(SAVE_KEY);
            if (e && e.length > 0) {
                var t = JSON.parse(e);
                console.warn("loading save: ", t), Object.assign(this, t)
            } else console.warn("no save, starting new game")
        },
        save: function() {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this))
        },
        clear: function() {
            localStorage.setItem(SAVE_KEY, ""), window.location.reload()
        }
    };
var Ftue0 = pc.createScript("ftue0");
Ftue0.attributes.add("cameraBunny", {
    type: "entity"
}), Ftue0.attributes.add("notification", {
    type: "entity"
}), Ftue0.attributes.add("notificationText", {
    type: "entity"
}), Ftue0.prototype.play = function() {
    Platform.event("ftue0-start"), Platform.userProperty({
        level: "ftue0",
        hover: "catfish",
        color: 0
    }), this.active = !0, this.sequenceScale = 1.1, Helper.params.realDebug && Helper.dat.add(this, "sequenceScale", 0, 1), Helper.playerE.setPosition(Helper.level.getPlayerRespawn()), this.cameraBunny.setPosition(Helper.playerE.getPosition()), this.notification.setLocalPosition(0, 300, 0), Helper.playerE.script.touchInput.disableControls(), Helper.playerE.script.touchInput.hideControls(), Helper.camera.lookClose(), Helper.pickups.pickupMax = 0, SFX.switchVolume(0, 0);
    var e = this;
    Utils.waitForSeconds(.5 * e.sequenceScale).then((function() {
        Helper.game.showNotification2(Locale.get("ftue0_stage0"), 1.2 * e.sequenceScale, .7 * e.sequenceScale, !1, !1).then((function() {
            Helper.game.showNotification2(Locale.get("ftue0_stage1"), 1.2 * e.sequenceScale, .7 * e.sequenceScale, !1, !1).then((function() {
                var t = Helper.ai.spawnOne();
                t.script.player._state = PlayerState.IDLE, t.script.pickupReciever._currentExp = 0;
                var a = t.getPosition(),
                    r = Helper.playerE.getPosition();
                Utils.tweenV3(e.cameraBunny, r, a, 1 * e.sequenceScale, (function(e) {
                    var t;
                    if (!isNaN(e._time / e._dur)) {
                        t = Helper.ease.bounce(e._time / e._dur);
                        var a = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.startSequenceHeight + 5, t);
                        Helper.camera.directApply(a)
                    }
                })).then((function() {
                    Helper.game.showNotification2(Locale.get("ftue0_stage2"), 1.2 * e.sequenceScale, .7 * e.sequenceScale, !1, !1).then((function() {
                        Helper.game.showNotification2(Locale.get("ftue0_stage3"), 1.2 * e.sequenceScale, .7 * e.sequenceScale, !1, !1).then((function() {
                            Helper.playerE.script.touchInput.enableControls(), Helper.playerE.script.touchInput.showControls(), SFX.switchVolume(.015, 2e3), Utils.tweenV3(e.cameraBunny, a, r, .5 * e.sequenceScale, (function(e) {
                                if (!isNaN(e._time / e._dur)) {
                                    var t = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.regularHeight, e._time / e._dur);
                                    Helper.camera.directApply(t)
                                }
                            })).then((function() {
                                Helper.game.state = GameState.PLAYING_FTUE, Helper.playerE.script.player._state = PlayerState.RIDING, t.script.player._state = PlayerState.FTUE0
                            }))
                        }))
                    }))
                }))
            }))
        }))
    }))
}, Ftue0.prototype.diedFromRam = function() {
    Helper.game.showNotification(Locale.get("ftue_fail_ram"));
    var e = Helper.ai.spawnOne();
    e.script.pickupReciever._currentExp = 0, e.script.player._state = PlayerState.FTUE0
}, Ftue0.prototype.diedFromSpear = function() {
    Helper.game.showNotification(Locale.get("ftue_fail_spear"))
}, Ftue0.prototype.fraggedAi = function() {
    if (Helper.game.showNotification(Locale.get("ftue0_complete")), this.goNext(), Helper.ftue1.active) {
        var e = Helper.ai.spawnOne();
        e.script.pickupReciever._currentExp = 0, Helper.ftue0.active ? e.script.player._state = PlayerState.FTUE0 : Helper.ftue1.active && (e.script.player._state = PlayerState.RIDING)
    }
}, Ftue0.prototype.buggedAi = function() {
    var e = Helper.ai.spawnOne();
    e.script.pickupReciever._currentExp = 0, e.script.player._state = PlayerState.FTUE0
}, Ftue0.prototype.goNext = function() {
    SFX.switchVolume(0, 2e3), Platform.event("ftue0-complete");
    var e = {
        value: 1
    };
    gsap.fromTo(e, {
        value: 1
    }, {
        value: .1,
        duration: 1.1,
        onUpdate: function() {
            Helper.game.timeScale = e.value;
            var t = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.regularHeight, e.value);
            Helper.camera.directApply(t)
        }
    }), Utils.waitForSeconds(1.5).then((function() {
        Inventory.ftue0 = !1, Inventory.save(), Helper.game.reloadGame()
    }))
}, Ftue0.prototype.update = function(e) {};
var Ftue1 = pc.createScript("ftue1");
Ftue1.attributes.add("cameraBunny", {
    type: "entity"
}), Ftue1.attributes.add("notification", {
    type: "entity"
}), Ftue1.attributes.add("notificationText", {
    type: "entity"
}), Ftue1.attributes.add("uiCounters", {
    type: "entity"
}), Ftue1.attributes.add("uiHeartGroup", {
    type: "entity"
}), Ftue1.attributes.add("uiSessionTimer", {
    type: "entity"
}), Ftue1.prototype.play = function() {
    Platform.event("ftue1-start"), Platform.userProperty({
        level: "ftue1"
    }), this.active = !0, this.sequenceScale = 1, this.fragCounter = 0, Helper.params.realDebug && Helper.dat.add(this, "sequenceScale", 0, 1), Helper.level.currentLevel = "ftue1Level", Helper.level.manualInit(), Helper.playerE.setPosition(Helper.level.getPlayerRespawn()), this.cameraBunny.setPosition(Helper.playerE.getPosition()), this.notification.setLocalPosition(0, 300, 0), Helper.playerE.script.touchInput.disableControls(), Helper.playerE.script.touchInput.hideControls(), this.uiHeartGroup.enabled = !1, this.uiSessionTimer.enabled = !1, Helper.camera.lookClose(), this.uiCounters.setLocalPosition(0, 170, 0), SFX.switchVolume(0, 0);
    var e = this;
    Helper.pickups.pickupWeight = [10, 0, 0], Helper.pickups.pickupMax = 8, Helper.pickups.spawnPerFrame = 1, Helper.pickups.tick = new pc.Vec2(.5, 1), Helper.pickups.spawnAtOnce = new pc.Vec2(1, 1), Utils.waitForSeconds(.5 * e.sequenceScale).then((function() {
        Helper.game.showNotification2(Locale.get("ftue1_stage0"), 1.2 * e.sequenceScale, .7 * e.sequenceScale).then((function() {
            var t = Helper.pickups.spawnOne(),
                a = Helper.ai.spawnOne();
            a.script.player._state = PlayerState.IDLE, a.script.pickupReciever._currentExp = 0;
            var r = t.getPosition(),
                i = a.getPosition(),
                c = Helper.playerE.getPosition();
            Utils.tweenV3(e.cameraBunny, c, r, .9, (function(e) {
                var t;
                if (!isNaN(e._time / e._dur)) {
                    t = Helper.ease.bounce(e._time / e._dur);
                    var a = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.startSequenceHeight + 5, t);
                    Helper.camera.directApply(a)
                }
            })).then((function() {
                Helper.game.showNotification2(Locale.get("ftue1_stage1"), 1.2 * e.sequenceScale, .7 * e.sequenceScale).then((function() {
                    Utils.tweenV3(e.cameraBunny, r, i, .9, (function(e) {
                        var t;
                        if (!isNaN(e._time / e._dur)) {
                            t = Helper.ease.bounce(e._time / e._dur);
                            var a = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.startSequenceHeight + 5, t);
                            Helper.camera.directApply(a)
                        }
                    })).then((function() {
                        Helper.game.showNotification2(Locale.get("ftue1_stage2"), 1.2 * e.sequenceScale, .7 * e.sequenceScale).then((function() {
                            Helper.playerE.script.touchInput.enableControls(), Helper.playerE.script.touchInput.showControls(), SFX.switchVolume(.015, 2e3), Utils.tweenV3(e.cameraBunny, i, c, .9, (function(e) {
                                if (!isNaN(e._time / e._dur)) {
                                    var t = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.regularHeight, e._time / e._dur);
                                    Helper.camera.directApply(t)
                                }
                            })).then((function() {
                                Helper.playerE.script.touchInput.enableControls(), Helper.playerE.script.touchInput.showControls()
                            })), Helper.game.showNotification2(Locale.get("ftue1_stage3"), 1.2 * e.sequenceScale, .5 * e.sequenceScale).then((function() {
                                e.uiCounters.enabled = !0, e.uiCounters.script.tween.play(), Helper.game.state = GameState.PLAYING_FTUE, Helper.playerE.script.player._state = PlayerState.RIDING, a.script.player._state = PlayerState.RIDING
                            }))
                        }))
                    }))
                }))
            }))
        }))
    }))
}, Ftue1.prototype.diedFromRam = function() {
    Helper.game.showNotification(Locale.get("ftue_fail_ram"));
    var e = Helper.ai.spawnOne();
    e.script.pickupReciever._currentExp = 0, e.script.player._state = PlayerState.RIDING
}, Ftue1.prototype.diedFromSpear = function() {
    Helper.game.showNotification(Locale.get("ftue_fail_spear"))
}, Ftue1.prototype.fraggedAi = function() {
    var e = this;
    this.fragCounter += 1, 1 === this.fragCounter ? Helper.game.showNotification2(Locale.get("ftue1_success0_0"), 1.5 * e.sequenceScale, .4 * e.sequenceScale, !0, !1).then((function() {
        Helper.game.showNotification(Locale.get("ftue1_success0_1"), !1, !0);
        var e = Helper.ai.spawnOne();
        e.script.pickupReciever._currentExp = 0, e.script.player._state = PlayerState.RIDING
    })) : 2 === this.fragCounter && Helper.game.showNotification2(Locale.get("ftue1_success1_0"), 1.5 * e.sequenceScale, .4 * e.sequenceScale, !0, !1).then((function() {
        Helper.game.showNotification(Locale.get("ftue1_success1_1"), !1, !0);
        var e = Helper.ai.spawnOne();
        e.script.pickupReciever._currentExp = 0, e.script.player._state = PlayerState.RIDING
    })), 3 === this.fragCounter && Helper.game.showNotification2(Locale.get("ftue1_success_final0"), 1.5 * e.sequenceScale, .4 * e.sequenceScale, !0, !1).then((function() {
        e.goNext()
    }))
}, Ftue1.prototype.buggedAi = function() {
    var e = Helper.ai.spawnOne();
    e.script.pickupReciever._currentExp = 0, e.script.player._state = PlayerState.RIDING
}, Ftue1.prototype.goNext = function() {
    SFX.switchVolume(0, 2e3), Platform.event("ftue0-complete"), Helper.game.showNotification(Locale.get("ftue1_success_final1"), !1, !1), Inventory.coins += Helper.playerE.script.pickupReciever._currentExp, Inventory.frags += Helper.game.frags;
    var e = {
        value: 1
    };
    gsap.fromTo(e, {
        value: 1
    }, {
        value: .1,
        duration: 1.1,
        onUpdate: function() {
            Helper.game.timeScale = e.value;
            var t = pc.math.lerp(Helper.camera.startSequenceHeight, Helper.camera.regularHeight, e.value);
            Helper.camera.directApply(t)
        }
    }), Utils.waitForSeconds(1.5).then((function() {
        Inventory.ftue1 = !1, Inventory.save(), Helper.game.reloadGame()
    }))
}, Ftue1.prototype.update = function(e) {};
var Ftue2 = pc.createScript("ftue2");
Ftue2.prototype.initialize = function() {}, Ftue2.prototype.update = function(t) {};
var Utils = {
    launchEndlessPowerup: function(e) {
        var n = Helper.game.rules;
        if (n.ruleset === GameRules.CONSTANT_POWERUP) {
            var t = "powerup" + n.constantPowerup.charAt(0).toUpperCase() + n.constantPowerup.slice(1);
            e.script[t].launchEndless()
        }
    },
    waitForSeconds: function(e) {
        return new Promise((function(n) {
            setTimeout(n, 1e3 * e)
        }))
    },
    tweenV3: function(e, n, t, o, u) {
        return new Promise((function(r) {
            var a = {
                x: 0,
                y: 0,
                z: 0
            };
            gsap.fromTo(a, {
                x: n.x,
                y: n.y,
                z: n.z
            }, {
                x: t.x,
                y: t.y,
                z: t.z,
                duration: o,
                onUpdate: function() {
                    e.setPosition(a.x, a.y, a.z), u && u(this)
                },
                onComplete: r
            })
        }))
    },
    scaleBounce: function(e, n, t, o, u) {
        var r = {
            value: 0
        };
        return gsap.fromTo(r, {
            value: n
        }, {
            value: t,
            duration: o,
            ease: u || "elastic.out(1.55, 0.5)",
            onUpdate: function() {
                e.setLocalScale(r.value, r.value, r.value)
            }
        })
    },
    scaleBounceIn: function(e, n, t, o) {
        var u = {
            value: 0
        };
        return gsap.fromTo(u, {
            value: n
        }, {
            value: t,
            duration: o,
            ease: "elastic.inOut(0.5, 0.5)",
            onUpdate: function() {
                e.setLocalScale(u.value, u.value, u.value)
            }
        })
    },
    valueBounce: function(e, n, t, o, u, r) {
        return gsap.fromTo(e, {
            [n]: t
        }, {
            [n]: o,
            duration: u,
            ease: r || "elastic.out(1.55, 0.5)"
        })
    },
    textBounce: function(e, n, t, o, u) {
        return new Promise((function(r) {
            if (n === t) return r();
            var a = {
                value: 0
            };
            gsap.fromTo(a, {
                value: n
            }, {
                value: t,
                duration: o,
                onUpdate: function() {
                    e.element.text = `${u}${Math.floor(a.value)}`
                },
                onComplete: r
            })
        }))
    },
    opacityBounce: function(e, n, t, o) {
        return gsap.fromTo(e, {
            opacity: n
        }, {
            opacity: t,
            duration: o
        })
    },
    lastSecond: function(e) {
        return !(e < 1 && e > .85) && (!(e < .7 && e > .55) && !(e < .4 && e > .25))
    },
    loadFromSheetProxy: function(e) {
        return new Promise((function(n, t) {
            fetch(`https://nikitka.codes:3000/load-sheet/1s0ME2mSF5LvI-XjPj27rnqHLc6f_ISvfiyLw-77m_mM/${e}`).then((function(e) {
                return e.json()
            })).then((function(e) {
                for (var t = e.result.split("\n").map((function(e) {
                        return e.split(",")
                    })), o = t.splice(0, 1)[0].map((function(e) {
                        return e.trim()
                    })), u = t.length - 1; u >= 0; u--) 0 === t[u][0].length && t.splice(u, 1);
                n([t, o])
            })).catch((function(e) {
                t(e)
            }))
        }))
    },
    parseStaticProg: function(e) {
        for (var n = e.result.split("\n").map((function(e) {
                return e.split(",")
            })), t = n.splice(0, 1)[0].map((function(e) {
                return e.trim()
            })), o = n.length - 1; o >= 0; o--) 0 === n[o][0].length && n.splice(o, 1);
        return [n, t]
    }
};
var ScreenResult = pc.createScript("screenResult");
ScreenResult.attributes.add("header", {
    type: "entity"
}), ScreenResult.attributes.add("coinRoot", {
    type: "entity"
}), ScreenResult.attributes.add("coinText", {
    type: "entity"
}), ScreenResult.attributes.add("fragRoot", {
    type: "entity"
}), ScreenResult.attributes.add("fragText", {
    type: "entity"
}), ScreenResult.attributes.add("nextUnlockText", {
    type: "entity"
}), ScreenResult.attributes.add("progressBar", {
    type: "entity"
}), ScreenResult.attributes.add("progressBarFill", {
    type: "entity"
}), ScreenResult.attributes.add("progressBarMaxFill", {
    type: "number"
}), ScreenResult.attributes.add("x2RewardsButton", {
    type: "entity"
}), ScreenResult.attributes.add("plusProgressButton", {
    type: "entity"
}), ScreenResult.attributes.add("button", {
    type: "entity"
}), ScreenResult.prototype.initialize = function() {
    this.entity.setLocalPosition(16, 1280, 0), this.button.element.once("click", (function() {
        this.button.button.active = !1,            
         GAMESDK.showAd({
            beforeShowAd: () => {
                SFX.menuFadeEngine()
               
            },
            afterShowAd: () => {
                Helper.screenLevelIndicator.tween.kill(), setTimeout(Helper.game.reloadGame.bind(Helper.game), 50)
                SFX.menuReturnEngine();

            }
        })
    }), this), this.x2RewardsButton.element.once("click", (function() {
        this.button.button.active = !1, this.x2RewardsButton.button.active = !1, this.plusProgressButton.button.active = !1,
        GAMESDK.showAdOfEvent({
            onRewardBeforeBreak: () => {
                SFX.menuFadeEngine()
                this.button.button.active = !0, this.x2RewardsButton.button.active = !0, this.plusProgressButton.button.active = !0

            },
            onRewardAfterBreak: () => {
                SFX.menuReturnEngine();
                
            },
            onRewardComplete: () => {
                Utils.scaleBounceIn(this.x2RewardsButton, 1, 0, .5), Inventory.coins += this._currentCoins, Inventory.frags += this._currentFrags, Inventory.save(), Utils.textBounce(this.coinText, this._currentCoins, 2 * this._currentCoins, .5, "x"), Utils.textBounce(this.fragText, this._currentFrags, 2 * this._currentFrags, .5, "x").then(function() {
                    this.button.button.active = !0, this.x2RewardsButton.enabled = !1, this.plusProgressButton.button.active = !0
                }.bind(this)), this.plusProgressButton.enabled && this.plusProgressButton.script.tween.play()
              
            },
            onRewardDismissed: () => {

            }
        })
    }), this), this.plusProgressButton.element.once("click", (function() {
        this.button.button.active = !1, this.x2RewardsButton.button.active = !1, this.plusProgressButton.button.active = !1,
        
        GAMESDK.showAdOfEvent({
            onRewardBeforeBreak: () => {
                this.button.button.active = !0, this.x2RewardsButton.button.active = !0, this.plusProgressButton.button.active = !0
                SFX.menuFadeEngine()
            },
            onRewardAfterBreak: () => {
                SFX.menuReturnEngine();
                
            },
            onRewardComplete: () => {
                Helper.game.rememberUnlock(this._currentUnlock + .15), Utils.scaleBounceIn(this.plusProgressButton, 1, 0, .5);
                var t = {
                    value: 0
                };
                gsap.fromTo(t, {
                    value: this._currentUnlock * this.progressBarMaxFill
                }, {
                    value: Math.min(this._currentUnlock + .15, 1) * this.progressBarMaxFill,
                    duration: .5,
                    ease: Power2.easeOut,
                    onUpdate: function() {
                        this.progressBarFill.element.width = t.value
                    }.bind(this),
                    onComplete: function() {
                        this.progressBarFill.element.width >= this.progressBarMaxFill ? this.showUnlock() : (this.button.button.active = !0, this.plusProgressButton.enabled = !1, this.x2RewardsButton.button.active = !0)
                    }.bind(this)
                }), this.x2RewardsButton.enabled && this.x2RewardsButton.script.tween.play()
              
            },
            onRewardDismissed: () => {

            }
        })
    }), this), this.nextUnlockText.element.text = Locale.get("result_next_unlock"), this.x2RewardsButton.children[1].element.text = Locale.get("result_x2_rewards"), this.plusProgressButton.children[1].element.text = Locale.get("result_add_unlock")
}, ScreenResult.prototype.showUnlock = function() {
    this.button.button.active = !1, this.x2RewardsButton.button.active = !1, this.plusProgressButton.button.active = !1, Utils.scaleBounce(this.progressBarFill, .9, 1, .6), Utils.scaleBounce(this.progressBar, .9, 1, .6), Utils.waitForSeconds(.6).then(function() {
        this.entity.element.width;
        var t = {
            value: 0
        };
        gsap.to(t, {
            value: -1290,
            duration: .9,
            ease: "elastic.out(1.2, 1.8)",
            onUpdate: function() {
                this.entity.setLocalPosition(t.value, 32, -0)
            }.bind(this)
        }), Helper.popupUnlock.show()
    }.bind(this))
}, ScreenResult.prototype.show = function(t, e, n, s, o, i) {
    Helper.compositions.showFade(), this._currentCoins = e, this._currentFrags = n, this._currentUnlock = o, this.button.enabled = !1, this.coinRoot.enabled = !1, this.fragRoot.enabled = !1, this.nextUnlockText.enabled = !1, this.progressBar.enabled = !1, this.x2RewardsButton.enabled = !1, this.plusProgressButton.enabled = !1, this.entity.script.tween.play(), this.header.element.text = Locale.get(t), this.coinText.element.text = "x0", this.fragText.element.text = "x0";
    var r = Helper.tableUnlocking.nextUnlock,
        a = this,
        l = {
            value: 0
        },
        u = 0;
    Utils.waitForSeconds(.5).then((function() {
        a.coinRoot.enabled = !0, Utils.scaleBounce(a.coinRoot, .8, 1, .4), gsap.fromTo(l, {
            value: 0
        }, {
            value: e,
            duration: e > 0 ? .5 : .01,
            onUpdate: function() {
                a.coinText.element.text = `x${Math.floor(l.value)}`;
                var t = Math.floor(l.value);
                t > u && (u = t, SFX.playVariance("coin"))
            },
            onComplete: function() {
                u = 0, e > 0 && (Utils.scaleBounce(a.coinText, .9, 1, .4), SFX.playVariance("coin")), Utils.waitForSeconds(.5).then((function() {
                    a.fragRoot.enabled = !0, Utils.scaleBounce(a.fragRoot, .8, 1, .4), gsap.fromTo(l, {
                        value: 0
                    }, {
                        value: n,
                        duration: n > 0 ? .5 : .01,
                        onUpdate: function() {
                            a.fragText.element.text = `x${Math.floor(l.value)}`;
                            var t = Math.floor(l.value);
                            t > u && (u = t, SFX.playVariance("coin"))
                        },
                        onComplete: function() {
                            u = 0, n > 0 && (Utils.scaleBounce(a.fragText, .9, 1, .4), SFX.playVariance("coin")), Utils.waitForSeconds(.5).then((function() {
                                r >= 0 ? (a.nextUnlockText.enabled = !0, a.progressBar.enabled = !0, a.progressBarFill.enabled = !0, Utils.scaleBounce(a.nextUnlockText, .8, 1, .4), Utils.scaleBounce(a.progressBar, .8, 1, .4), u = s * a.progressBarMaxFill, gsap.fromTo(l, {
                                    value: s * a.progressBarMaxFill
                                }, {
                                    value: o * a.progressBarMaxFill,
                                    duration: 1.2,
                                    ease: Power2.easeOut,
                                    onUpdate: function() {
                                        a.progressBarFill.element.width = l.value;
                                        var t = Math.floor(l.value);
                                        t > u && (u = t, SFX.playVariance("coin"))
                                    },
                                    onComplete: function() {
                                        o * a.progressBarMaxFill >= a.progressBarMaxFill ? a.showUnlock.call(a) : Utils.waitForSeconds(.5).then((function() {
                                            a.x2RewardsButton.enabled = !0, Utils.scaleBounce(a.x2RewardsButton, .8, 1, .4), Utils.waitForSeconds(.2).then((function() {
                                                a.plusProgressButton.enabled = !0, Utils.scaleBounce(a.plusProgressButton, .8, 1, .4), Utils.waitForSeconds(1.5).then((function() {
                                                    a.button.enabled = !0, Utils.scaleBounce(a.button, .8, 1, .4)
                                                }))
                                            }))
                                        }))
                                    }
                                })) : (a.nextUnlockText.element.text = Locale.get("result_max_unlock"), a.nextUnlockText.enabled = !0, Utils.scaleBounce(a.nextUnlockText, .8, 1, .4), Utils.waitForSeconds(.5).then((function() {
                                    a.x2RewardsButton.enabled = !0, Utils.scaleBounce(a.x2RewardsButton, .8, 1, .4), Utils.waitForSeconds(1.5).then((function() {
                                        a.button.enabled = !0, Utils.scaleBounce(a.button, .8, 1, .4)
                                    }))
                                })))
                            }))
                        }
                    })
                }))
            }
        })
    }))
}, ScreenResult.prototype.update = function(t) {};
var Fonts = pc.createScript("fonts");
Fonts.attributes.add("woffAssets", {
    type: "asset",
    array: !0
}), Fonts.attributes.add("woffNames", {
    type: "string",
    array: !0
}), Fonts.prototype.initialize = function() {
    var t = this,
        e = this.app,
        s = 0;
    this._waitingInjections = [], this.ready = !1, this._assets = {};
    for (var o = 0; o < this.woffAssets.length; ++o) {
        new FontFace(this.woffNames[o], "url(" + this.woffAssets[o].getFileUrl() + ")").load().then((function(o) {
            document.fonts.add(o), s += 1;
            var a = new pc.CanvasFont(e, {
                color: new pc.Color(1, 1, 1),
                fontName: o.family,
                fontSize: 64,
                width: 512,
                height: 512
            });
            a.createTextures(" ");
            var n = new pc.Asset(o.family, "font", {});
            e.assets.add(n), n.resource = a, n.loaded = !0, t._assets[o.family] = {
                cf: a,
                asset: n
            }, s == t.woffAssets.length && (t.ready = !0, t.fire("complete_loading"))
        })).catch((function(t) {
            console.error(t)
        }))
    }
}, Fonts.prototype.lazyInit = function() {}, Fonts.prototype.injectFont = function(t, e) {
    this.ready ? (e.fontAsset = this._assets[t].asset, this._assets[t].cf.updateTextures(e.text)) : console.log("too early to inject")
}, Fonts.prototype.updateTexture = function(t, e) {
    this.ready ? this._assets[t].cf.updateTextures(e) : console.log("too early to update")
};
var FontInjector = pc.createScript("fontInjector");
FontInjector.attributes.add("family", {
    type: "string"
}), FontInjector.prototype.postInitialize = function() {
    Helper.fonts.ready ? Helper.fonts.injectFont(this.family, this.entity.element) : Helper.fonts.on("complete_loading", (function() {
        console.log("starting to inject"), Helper.fonts.injectFont(this.family, this.entity.element)
    }), this)
}, FontInjector.prototype.updateText = function(t) {
    Helper.fonts.ready && (Helper.fonts.updateTexture(this.family, t), this.entity.element.text = t)
};
var Locale = {
    current: "en",
    grid: null,
    semantic: null,
    keys: null,
    get: function(e, n, r) {
        return void 0 === n ? this.keys[e][this.current] : void 0 === r ? this.keys[e][this.current].replace("%value%", n) : this.keys[e][this.current].replace("%value%", n).replace("%value1%", r)
    },
    load: function() {
        var e = this;
        return new Promise((function(n, r) {
            if (null !== e.grid) return n();
            if (e.keys = {}, Helper.params.latestTables) Utils.loadFromSheetProxy("0").then((function(r) {
                e.grid = r[0], e.semantic = r[1];
                for (var t = 0; t < e.grid.length; t++) {
                    var l = e.grid[t],
                        a = l[0].trim();
                    e.keys[a] = {};
                    for (var i = 1; i < l.length; i++) e.keys[a][e.semantic[i]] = l[i].replace("%C%", ",").trim()
                }
                n()
            })).catch(r);
            else {
                var t = Utils.parseStaticProg({
                    status: "ok",
                    result: "key,ru,en\r\n,,\r\ncommon_coins,,ducats\r\ncommon_frags,,frags\r\ncommon_lives,,lives\r\ncommon_no,Нет,No\r\n,,\r\n,,\r\nftue0_stage0,Привет!,Hey!\r\nftue0_stage1,Это твой рыцарь,This is you\r\nftue0_stage2,Это чужой рыцарь,This is your contestant\r\nftue0_stage3,Победи его,Defeat him!\r\nftue0_complete,Ты молодец!,Great!\r\n,,\r\n,,\r\nftue1_stage0,Усложним задачу,Now%C% let's add some challenge\r\nftue1_stage1,Собирай дукаты,Collect those ducats!\r\nftue1_stage2,Побеждай рыцарей,Defeat opposing knights!\r\nftue1_stage3,Поехали!,Let's go!\r\n,,\r\nftue_fail_ram,Не уверен - не тарань,Ramming is often suicidal\r\nftue_fail_spear,Избегай копья,Beware the spear!\r\nftue_fail_hyper,Гиперспейс опасен,You were not the impostor\r\n,,\r\nftue1_success0_0,Неплохо!,Doin' good!\r\nftue1_success0_1,Попробуй еще!,Try again!\r\nftue1_success1_0,Отлично!,Awesome!\r\nftue1_success1_1,Последний разок,Just one more!\r\nftue1_success_final0,А ты хорош!,Yeah%C% you look knightly!\r\nftue1_success_final1,Давай по-настоящему,Now let's get real!\r\n,,\r\nui_button_play,Играть,Play\r\n,,\r\nnotify_result_time_up,Время вышло!,Time's up!\r\nnotify_result_survive_win,Королевский!,You're the king!\r\nnotify_result_collect_coins_win,Собрано!,Ducats collected!\r\nnotify_result_eliminate_enemies_win,Уничтожено!,Elimination complete!\r\nnotify_result_eliminate_king_win,Короли уничтожены,Assassination complete!\r\nnotify_result_out_of_lives,Кончились жизни!,You're out of lives!\r\n,,\r\nresult_header_success,Победитель!,Winner!\r\nresult_header_lost,Попробуй еще,Try again\r\nresult_next_unlock,Следующий бонус:,Next Unlock:\r\nresult_max_unlock,Максимальный уровень бонусов,Max unlocks level\r\nresult_x2_rewards,X2 Награда,X2 Rewards\r\nresult_add_unlock,+15% Бонус,+15% Unlock\r\n,,\r\nunlock_powerup_nitro,Разблокировано нитро!,Nitro unlocked!\r\nunlock_powerup_shield,Разблокирован щит!,Shield unlocked!\r\nunlock_powerup_enlarger,Разблокирован увеличитель!,Enlarger unlocked!\r\nunlock_powerup_sphere,Разблокированы сферы!,Spheres unlocked!\r\nunlock_powerup_smoke,Разблокировано замедление!,Smoke unlocked!\r\nunlock_powerup_shooter,Разблокирована пушка!,Gun unlocked!\r\n,,\r\ngoal_survive,Стань королем,Become the king\r\ngoal_survive_special,Оставайся королем,Stay the king\r\ngoal_collect_coins,Собрано дукатов: %value%/%value1%,Ducats collected: %value%/%value1%\r\ngoal_eliminate_enemies,Побеждено соперников: %value%/%value1%,Enemies eliminated : %value%/%value1%\r\ngoal_eliminate_king,Побеждено королей: %value%/%value1%,Kings assassinated : %value%/%value1%\r\n,,\r\n,,\r\n,,\r\n,,\r\nlevel_indicator_header,Уровень %value%,Level %value%\r\nlevel_indicator_survive,Стань королем,Become the king\r\nlevel_indicator_collect_coins,Собери %value% дукатов,Collect %value% ducats\r\nlevel_indicator_eliminate_enemies,Уничтожь %value% соперников,Eliminate %value% enemies\r\nlevel_indicator_constant_powerup_nitro,нитро безумие,nitro madness\r\nlevel_indicator_constant_powerup_enlarger,турнир по фехтованию,fencing tournament\r\nlevel_indicator_constant_powerup_sphere,мастер пространства,zen masters\r\nlevel_indicator_constant_powerup_shooter,догфайт,dogfight\r\nlevel_indicator_random_powerup,случайные усилители,random powerups tournament\r\nlevel_indicator_eliminate_king,Уничтожь %value% королей,Assassinate %value% kings\r\nlevel_indicator_eliminate_special,не умирая,while staying alive\r\n,,\r\nmain_menu_play,Играть,Play\r\nshop_select,Выбрать,Select\r\nshop_buy,Купить,Unlock\r\n,,\r\ncountdown_go,Поехали!,GO!\r\n,,\r\npopup_last_chance_header,Последний шанс?,Last chance?\r\npopup_last_chance_life,+1 Жизнь,+1 Life\r\npopup_last_chance_time,+ Время,+Timer"
                });
                e.grid = t[0], e.semantic = t[1];
                for (var l = 0; l < e.grid.length; l++) {
                    var a = e.grid[l],
                        i = a[0].trim();
                    e.keys[i] = {};
                    for (var s = 1; s < a.length; s++) e.keys[i][e.semantic[s]] = a[s].replace("%C%", ",").trim()
                }
                n()
            }
        }))
    }
};
var ScreenProfileMoney = pc.createScript("screenProfileMoney");
ScreenProfileMoney.attributes.add("coinIcon", {
    type: "entity"
}), ScreenProfileMoney.attributes.add("coinText", {
    type: "entity"
}), ScreenProfileMoney.attributes.add("fragIcon", {
    type: "entity"
}), ScreenProfileMoney.attributes.add("fragText", {
    type: "entity"
}), ScreenProfileMoney.prototype.postInitialize = function() {
    this.coinText.element.text = Inventory.coins, this.fragText.element.text = Inventory.frags
}, ScreenProfileMoney.prototype.updateMoney = function() {
    var e = Number.parseInt(this.coinText.element.text),
        t = Inventory.coins;
    Utils.textBounce(this.coinText, e, t, .5, ""), Utils.scaleBounce(this.coinIcon, .8, 1, .5)
}, ScreenProfileMoney.prototype.updateFrags = function() {
    var e = Number.parseInt(this.fragText.element.text),
        t = Inventory.frags;
    Utils.textBounce(this.fragText, e, t, .5, ""), Utils.scaleBounce(this.fragIcon, .8, 1, .5)
};
var ShaderFloor = pc.createScript("shaderFloor");
ShaderFloor.attributes.add("vs", {
    type: "asset",
    assetType: "shader",
    title: "Vertex Shader"
}), ShaderFloor.attributes.add("fs", {
    type: "asset",
    assetType: "shader",
    title: "Fragment Shader"
}), ShaderFloor.attributes.add("texture", {
    type: "asset"
}), ShaderFloor.attributes.add("textureAdd", {
    type: "asset"
}), ShaderFloor.attributes.add("cellSize", {
    type: "number"
}), ShaderFloor.prototype.initialize = function() {
    if (!0 !== this.shaderInited) {
        this.highlightPos = new pc.Vec2, this.radius = 0, this.brightness = 0, this.time = 0, this.shaderInited = !0;
        var e = this.app.graphicsDevice,
            t = this.vs.resource,
            a = "precision " + e.precision + " float;\n";
        a += this.fs.resource;
        var r = {
            attributes: {
                vVertex: pc.SEMANTIC_POSITION,
                vNormal: pc.SEMANTIC_NORMAL,
                vTexCoord: pc.SEMANTIC_TEXCOORD0
            },
            vshader: t,
            fshader: a
        };
        this.shader = new pc.Shader(e, r), this.material = new pc.Material, this.material.name = "ShaderFloor", this.material.shader = this.shader, this.material.chunks = {}, this.material.alphaWrite = !1, this.material.depthTest = !0, this.material.setParameter("uCellSize", this.cellSize), this.material.setParameter("uTexture", this.texture.resource), this.material.setParameter("uTextureAdd", this.textureAdd.resource), this.entity.model.meshInstances[0].material = this.material
    }
}, ShaderFloor.prototype.update = function(e) {
    this.shaderInited && (this.material.setParameter("uCellSize", this.cellSize), this.material.setParameter("uHighlight", [this.highlightPos.x, this.highlightPos.y]), this.material.setParameter("uRadius", this.radius), this.material.setParameter("uBrightness", this.brightness), this.material.update())
};
var ScreenLevelIndicator = pc.createScript("screenLevelIndicator");
ScreenLevelIndicator.attributes.add("levelNumberText", {
    type: "entity"
}), ScreenLevelIndicator.attributes.add("levelRulesText", {
    type: "entity"
}), ScreenLevelIndicator.attributes.add("levelNotesText", {
    type: "entity"
}), ScreenLevelIndicator.attributes.add("layoutGroup", {
    type: "entity"
}), ScreenLevelIndicator.attributes.add("levelIndicatorPrefab", {
    type: "asset"
}), ScreenLevelIndicator.prototype.postInitialize = function() {
    if (!(Helper.game.state.indexOf("ftue") >= 0))
        if (void 0 === Helper.game.rules) this.levelNumberText.enabled = !1, this.levelRulesText.enabled = !1;
        else {
            this.levelNumberText.element.text = Locale.get("level_indicator_header", Helper.game.level + 1);
            var e, t, l = Helper.game.rules;
            if (l.ruleset == GameRules.CONSTANT_POWERUP) {
                var r = l.constantPowerup;
                this.levelRulesText.element.text = Locale.get("level_indicator_eliminate_enemies", l.frags), this.levelNotesText.element.text = Locale.get(`level_indicator_${l.ruleset.toLowerCase()}_${r}`), this.levelNotesText.enabled = !0
            } else l.ruleset == GameRules.RANDOM_POWERUP ? (this.levelRulesText.element.text = Locale.get("level_indicator_eliminate_enemies", l.frags), this.levelNotesText.element.text = Locale.get(`level_indicator_${l.ruleset.toLowerCase()}`), this.levelNotesText.enabled = !0) : l.ruleset == GameRules.ELIMINATE_KING ? (this.levelRulesText.element.text = Locale.get(`level_indicator_${l.ruleset.toLowerCase()}`, l.frags), this.levelNotesText.enabled = !1) : l.ruleset == GameRules.ELIMINATE_SPECIAL ? (this.levelRulesText.element.text = Locale.get("level_indicator_eliminate_enemies", l.frags), this.levelNotesText.element.text = Locale.get(`level_indicator_${l.ruleset.toLowerCase()}`), this.levelNotesText.enabled = !0) : (this.levelNotesText.enabled = !1, e = `level_indicator_${l.ruleset.toLowerCase()}`, l.ruleset === GameRules.COLLECT_COINS ? this.levelRulesText.element.text = Locale.get(e, l.coins) : l.ruleset === GameRules.ELIMINATE_ENEMIES ? this.levelRulesText.element.text = Locale.get(e, l.frags) : this.levelRulesText.element.text = Locale.get(e));
            var a = Helper.game.rules.location,
                s = Helper.game.level % TableProgression.levels.length,
                i = -1,
                n = -1;
            for (t = 0; t < TableProgression.levels.length; t++) {
                var o = TableProgression.levels[t];
                if (o.location === a && -1 === i && (i = t), o.location > a && i > -1 && -1 === n) {
                    n = t - 1;
                    break
                }
            }
            s -= i, -1 === n && (n = TableProgression.levels.length - 1), this.renderers = [], this.current = null, this.tween = null;
            var v = n - i + 1;
            for (console.log(`entered location ${a}: ${i}-${n}, levels total: ${v}, progress: ${s}/${v-1}`), t = 0; t < v; t++) {
                var c = this.levelIndicatorPrefab.resource.instantiate();
                if (c.reparent(this.layoutGroup), this.renderers.push(c), t === s) {
                    c.children[2].enabled = !1, this.current = c;
                    var u = this,
                        d = {
                            value: 0
                        };
                    this.tween = gsap.fromTo(d, .6, {
                        value: 0
                    }, {
                        value: 1,
                        yoyo: !0,
                        repeat: -1,
                        onUpdate: function() {
                            u.current.children[1].element.opacity = d.value
                        }
                    })
                }
                t > s && (c.children[1].enabled = !1, c.children[2].enabled = !1)
            }
        }
};
var TableProgression = {
    grid: null,
    semantic: null,
    levels: [],
    load: function() {
        var e = this;
        return new Promise((function(r, l) {
            if (null !== e.grid) return r();
            if (Helper.params.latestTables) Utils.loadFromSheetProxy("1969134496").then((function(l) {
                e.grid = l[0], e.semantic = l[1];
                for (var n = 0; n < e.grid.length; n++) {
                    var a = e.grid[n],
                        i = {
                            location: Number.parseInt(a[e.semantic.indexOf("location")]),
                            ruleset: a[e.semantic.indexOf("ruleset")],
                            timer: Number.parseInt(a[e.semantic.indexOf("timer")]),
                            lives: Number.parseInt(a[e.semantic.indexOf("lives")]),
                            coins: Number.parseInt(a[e.semantic.indexOf("coins")]),
                            frags: Number.parseInt(a[e.semantic.indexOf("frags")]),
                            map: a[e.semantic.indexOf("map")],
                            walls: Number.parseInt(a[e.semantic.indexOf("walls")]),
                            cellSize: Number.parseFloat(a[e.semantic.indexOf("cellSize")]),
                            biome: a[e.semantic.indexOf("biome")],
                            enemiesMax: Number.parseInt(a[e.semantic.indexOf("enemiesMax")]),
                            pickupsMax: Number.parseInt(a[e.semantic.indexOf("pickupsMax")]),
                            constantPowerup: a[e.semantic.indexOf("constantPowerup")],
                            excludePickup: a[e.semantic.indexOf("excludePickup")].split("|").map((function(e) {
                                return e.trim()
                            }))
                        };
                    e.levels.push(i)
                }
                r()
            })).catch(l);
            else {
                var n = Utils.parseStaticProg({
                    status: "ok",
                    result: "location,ruleset,,timer,lives,coins,frags,,map,walls,cellSize,,enemiesMax,pickupsMax,,constantPowerup,excludePickup,,,\r\n,,,,,,,,,,,,,,,,,,,\r\n0,COLLECT_COINS,,40,2,30,,,levelRegular,,1.4,,3,10,,,,,,0\r\n0,ELIMINATE_ENEMIES,,60,2,,2,,levelRegular,,1.4,,3,10,,,,,,1\r\n0,ELIMINATE_ENEMIES,,60,2,,3,,levelRegular,,1.4,,3,10,,,,,,2\r\n0,COLLECT_COINS,,40,2,50,,,levelRegular,,1.4,,3,10,,,,,,3\r\n0,ELIMINATE_SPECIAL,,120,1,,3,,levelRegular,,1.4,,3,10,,,,,,4\r\n,,,,,,,,,,,,,,,,,,,\r\n,,,,,,,,,,,,,,,,,,,\r\n1,ELIMINATE_ENEMIES,,100,2,,4,,levelRegular,,1.5,,4,15,,,,,,5\r\n1,COLLECT_COINS,,120,2,80,,,levelRegular,,1.5,,4,15,,,,,,6\r\n1,CONSTANT_POWERUP,,60,3,,3,,levelRegular,,1.5,,4,15,,nitro,powerup_nitro,,,7\r\n1,COLLECT_COINS,,140,2,100,,,levelRegular,,1.5,,4,15,,,,,,8\r\n1,SURVIVE,,60,2,,,,levelRegular,3,1.5,,4,15,,enlarger,powerup_enlarger|powerup_shooter,,,9\r\n,,,,,,,,,,,,,,,,,,,\r\n2,ELIMINATE_SPECIAL,,80,2,,4,,levelRegular,,1.5,,5,20,,,,,,10\r\n2,ELIMINATE_ENEMIES,,80,2,,4,,levelRegular,,1.5,,5,20,,,,,,11\r\n2,ELIMINATE_KING,,90,2,,2,,levelRegular,,1.5,,5,10,,,,,,12\r\n2,COLLECT_COINS,,160,2,120,,,levelRegular,,1.5,,5,20,,,,,,13\r\n2,CONSTANT_POWERUP,,150,2,,4,,levelWalled,3,1.5,,5,20,,sphere,powerup_sphere,,,14\r\n,,,,,,,,,,,,,,,,,,,\r\n3,ELIMINATE_ENEMIES,,120,2,,4,,levelRegular,,1.6,,6,30,,,,,,15\r\n3,ELIMINATE_KING,,150,3,,3,,levelWalled,,1.6,,6,10,,,,,,16\r\n3,SURVIVE,,80,3,,,,levelRegular,,1.6,,6,30,,,,,,17\r\n3,CONSTANT_POWERUP,,120,3,,4,,levelWalled,4,1.6,,6,30,,enlarger,powerup_enlarger|powerup_shooter,,,18\r\n3,COLLECT_COINS,,80,3,150,,,levelRegular,,1.6,,6,30,,,,,,19\r\n3,ELIMINATE_KING,,200,4,,3,,levelWalled,4,1.6,,6,10,,,,,,20\r\n,,,,,,,,,,,,,,,,,,,\r\n4,CONSTANT_POWERUP,,120,3,,5,,levelWalled,,1.6,,6,40,,nitro,powerup_nitro,,,21\r\n4,CONSTANT_POWERUP,,120,3,,5,,levelWalled,,1.6,,6,40,,enlarger,powerup_enlarger|powerup_shooter,,,22\r\n4,CONSTANT_POWERUP,,120,3,,5,,levelWalled,,1.6,,6,40,,sphere,powerup_sphere,,,23\r\n4,SURVIVE,,120,3,,,,levelWalled,,1.6,,6,40,,,,,,24\r\n4,COLLECT_COINS,,150,3,170,,,levelWalled,,1.6,,6,40,,,,,,25\r\n4,ELIMINATE_ENEMIES,,150,3,,5,,levelRegular,5,1.6,,6,40,,,,,,26\r\n,,,,,,,,,,,,,,,,,,,\r\n5,SURVIVE,,60,3,,,,levelWalled,3,1.5,,6,40,,,,,,27\r\n5,CONSTANT_POWERUP,,150,3,,6,,levelWalled,3,1.5,,6,40,,enlarger,powerup_enlarger|powerup_shooter,,,28\r\n5,ELIMINATE_KING,,200,3,,4,,levelWalled,3,1.5,,6,10,,,,,,29\r\n5,CONSTANT_POWERUP,,120,3,,6,,levelRegular,,1.5,,6,45,,shooter,powerup_shooter,,,30\r\n5,RANDOM_POWERUP,,150,3,,7,,levelRegular,,1.5,,6,45,,,,,,31\r\n,,,,,,,,,,,,,,,,,,,\r\n6,CONSTANT_POWERUP,,120,3,,6,,levelWalled,,1.6,,7,45,,nitro,powerup_nitro,,,32\r\n6,CONSTANT_POWERUP,,120,3,,6,,levelWalled,,1.6,,7,45,,enlarger,powerup_enlarger|powerup_shooter,,,33\r\n6,CONSTANT_POWERUP,,120,3,,6,,levelWalled,,1.6,,7,45,,sphere,powerup_sphere,,,34\r\n6,COLLECT_COINS,,150,3,200,,,levelWalled,,1.6,,7,45,,,,,,35\r\n6,SURVIVE,,120,3,,,,levelWalled,,1.6,,7,45,,,,,,36\r\n6,ELIMINATE_ENEMIES,,150,3,,7,,levelRegular,7,1.6,,7,45,,,,,,37\r\n,,,,,,,,,,,,,,,,,,,\r\n7,SURVIVE,,60,3,,,,levelWalled,3,1.7,,8,50,,,,,,38\r\n7,CONSTANT_POWERUP,,150,3,,8,,levelWalled,3,1.7,,8,50,,enlarger,powerup_enlarger|powerup_shooter,,,39\r\n7,ELIMINATE_KING,,200,3,,5,,levelWalled,3,1.7,,8,50,,,,,,40\r\n7,CONSTANT_POWERUP,,120,3,,8,,levelRegular,6,1.7,,8,50,,shooter,powerup_shooter,,,41\r\n7,RANDOM_POWERUP,,150,3,,8,,levelRegular,6,1.7,,8,50,,,,,,42\r\n7,RANDOM_POWERUP,,150,3,,10,,levelRegular,6,1.7,,8,50,,,,,,43"
                });
                e.grid = n[0], e.semantic = n[1];
                for (var a = 0; a < e.grid.length; a++) {
                    var i = e.grid[a],
                        s = {
                            location: Number.parseInt(i[e.semantic.indexOf("location")]),
                            ruleset: i[e.semantic.indexOf("ruleset")],
                            timer: Number.parseInt(i[e.semantic.indexOf("timer")]),
                            lives: Number.parseInt(i[e.semantic.indexOf("lives")]),
                            coins: Number.parseInt(i[e.semantic.indexOf("coins")]),
                            frags: Number.parseInt(i[e.semantic.indexOf("frags")]),
                            map: i[e.semantic.indexOf("map")],
                            walls: Number.parseInt(i[e.semantic.indexOf("walls")]),
                            cellSize: Number.parseFloat(i[e.semantic.indexOf("cellSize")]),
                            biome: i[e.semantic.indexOf("biome")],
                            enemiesMax: Number.parseInt(i[e.semantic.indexOf("enemiesMax")]),
                            pickupsMax: Number.parseInt(i[e.semantic.indexOf("pickupsMax")]),
                            constantPowerup: i[e.semantic.indexOf("constantPowerup")],
                            excludePickup: i[e.semantic.indexOf("excludePickup")].split("|").map((function(e) {
                                return e.trim()
                            }))
                        };
                    e.levels.push(s)
                }
                r()
            }
        }))
    }
};
var Loading = pc.createScript("loading");
Loading.prototype.initialize = function() {
    var e = this;
    Platform.init().then((function() {
        Promise.all([TableProgression.load(), Locale.load(), TablePurchases.load()]).then((function() {
            e.completeLoad.call(e)
        }))
    }))
}, Loading.prototype.completeLoad = function() {
    for (Helper.reloading = !0; this.app.root.children.length > 0;) {
        var e = this.app.root.children[0];
        this.app.root.removeChild(e), e.destroy()
    }
    Helper.clearCache();
    var o = this.app.scenes.find("Main");
    this.app.scenes.loadSceneHierarchy(o.url, (function(e, o) {
        e && console.error(e), Helper.reloading = !1
    }))
    GAMESDK.recordOpen();
};
var TableUnlocking = pc.createScript("tableUnlocking");
TableUnlocking.attributes.add("itemIds", {
    type: "string",
    array: !0
}), TableUnlocking.attributes.add("unlockRates", {
    type: "vec2",
    array: !0
}), TableUnlocking.attributes.add("previewTextures", {
    type: "asset",
    array: !0
}), TableUnlocking.attributes.add("fallbackTexture", {
    type: "asset"
}), TableUnlocking.prototype.postInitialize = function() {
    for (var t = Inventory.pickups, e = 0; e < this.itemIds.length; e++) {
        var a = this.itemIds[e];
        if (!(t.indexOf(a) >= 0)) return void(this.nextUnlock = e)
    }
    this.nextUnlock = -1
};
var Crown = pc.createScript("crown");
Crown.attributes.add("color", {
    type: "rgb"
}), Crown.attributes.add("color2", {
    type: "rgb"
}), Crown.prototype.postInitialize = function() {
    this.shader = Helper.game.shaders.findByName("Coin").script.shaderMatcap.getShaderInstance(), this.entity.model.meshInstances[2].material = this.shader.material, this.entity.model.meshInstances[1].material = this.shader.material, this.shader.injectMeshInsance([this.entity.model.meshInstances[1], this.entity.model.meshInstances[2]]), this.entity.model.meshInstances[1].setParameter("uTint", [this.color.r, this.color.g, this.color.b]), this.entity.model.meshInstances[2].setParameter("uTint", [this.color2.r, this.color2.g, this.color2.b])
}, Crown.prototype.update = function(t) {};
var PowerupEnlarger = pc.createScript("powerupEnlarger");
PowerupEnlarger.attributes.add("enlargerTime", {
    type: "number"
}), PowerupEnlarger.attributes.add("lanceLineEndPos", {
    type: "vec2"
}), PowerupEnlarger.attributes.add("enlargerVisualScale", {
    type: "vec2"
}), PowerupEnlarger.prototype.postInitialize = function() {
    this._time = 0, this._enlargeTween = null, this._scaleUpTween = null, this._ensmallTween = null, this._scaleDownTween = null
}, PowerupEnlarger.prototype.launchEndless = function() {
    this.enlargerTime = 999, this.launch()
}, PowerupEnlarger.prototype.launch = function() {
    if (this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED)
        if (this._time > 0) this._time = this.enlargerTime;
        else {
            this._time = this.enlargerTime, this._ensmallTween && (this._ensmallTween.kill(), this._scaleDownTween.kill(), this._ensmallTween = this._scaleDownTween = null);
            var e = this,
                t = {
                    value: 0
                };
            this._enlargeTween = gsap.fromTo(t, {
                value: this.enlargerVisualScale.x
            }, {
                value: this.enlargerVisualScale.y,
                duration: 1,
                ease: "elastic.out(1.55, 0.5)",
                onUpdate: function() {
                    e.entity.script.skinComponent._skin.enlargerVisual.setLocalScale(.1, t.value, .1), e._enlargeTween = null
                }
            });
            var n = {
                value: 0
            };
            this._scaleUpTween = gsap.fromTo(n, {
                value: this.lanceLineEndPos.x
            }, {
                value: this.lanceLineEndPos.y,
                duration: .65,
                onUpdate: function() {
                    e.entity.script.skinComponent._skin.lanceLineEnd.setLocalPosition(0, 0, n.value), e._scaleUpTween = null
                }
            })
        }
}, PowerupEnlarger.prototype.turnOff = function() {
    this._enlargeTween && this._enlargeTween.kill(), this._scaleUpTween && this._scaleUpTween.kill(), this._time = 0, this.entity.script.skinComponent._skin.enlargerVisual.setLocalScale(.1, 0, .1), this.entity.script.skinComponent._skin.lanceLineEnd.setLocalPosition(0, 0, this.lanceLineEndPos.x)
}, PowerupEnlarger.prototype.update = function(e) {
    if (this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED) {
        if (e *= Helper.game.timeScale, Utils.lastSecond(this._time) ? this.entity.script.skinComponent._skin.enlargerVisual.enabled = !0 : this.entity.script.skinComponent._skin.enlargerVisual.enabled = !1, this._time > 0 && this._time - e <= 0) {
            var t = this,
                n = {
                    value: 0
                };
            this._ensmallTween = gsap.fromTo(n, {
                value: this.enlargerVisualScale.y
            }, {
                value: this.enlargerVisualScale.x,
                duration: .5,
                ease: "elastic.out(1.55, 0.5)",
                onUpdate: function() {
                    t.entity.script.skinComponent._skin.enlargerVisual.setLocalScale(.1, n.value, .1)
                }
            });
            var i = {
                value: 0
            };
            this._scaleDownTween = gsap.fromTo(i, {
                value: this.lanceLineEndPos.y
            }, {
                value: this.lanceLineEndPos.x,
                duration: .5,
                ease: "linear",
                onUpdate: function() {
                    t.entity.script.skinComponent._skin.lanceLineEnd.setLocalPosition(0, 0, i.value)
                }
            })
        }
        this._time -= e
    }
};
var PowerupSphere = pc.createScript("powerupSphere");
PowerupSphere.attributes.add("sphereTime", {
    type: "number"
}), PowerupSphere.attributes.add("radius", {
    type: "number"
}), PowerupSphere.attributes.add("speed", {
    type: "number"
}), PowerupSphere.attributes.add("visual", {
    type: "entity",
    array: !0
}), PowerupSphere.prototype.initialize = function() {
    this._time = 0, this._spheres = 0, this._tweens = [], this._angles = [0, Math.PI];
    for (var e = 0; e < this.visual.length; e++) this.visual[e].setLocalScale(0, 0, 0)
}, PowerupSphere.prototype.launchEndless = function() {
    this.sphereTime = 999, this.launch(), this.launch()
}, PowerupSphere.prototype.launch = function() {
    this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (this._time = this.sphereTime, 0 === this._spheres ? (this._spheres = 1, this._tweens[0] && this._tweens[0].kill(), this._tweens[0] = Utils.scaleBounce(this.visual[0], 0, .5, .8), Helper.level._grid.attachProjectile(this.visual[0])) : 1 === this._spheres && (this._spheres = 2, this._tweens[1] && this._tweens[1].kill(), this._tweens[1] = Utils.scaleBounce(this.visual[1], 0, .5, .8), Helper.level._grid.attachProjectile(this.visual[1])))
}, PowerupSphere.prototype.turnOff = function() {
    this._time = 0, this._spheres = 0;
    for (var e = 0; e < this._tweens.length; e++) null !== this._tweens[e] && (this._tweens[e].kill(), this._tweens[e] = null);
    Helper.level._grid.removeProjectile(this.visual[0].script.actor.id), Helper.level._grid.removeProjectile(this.visual[1].script.actor.id), this.visual[0].setLocalScale(0, 0, 0), this.visual[1].setLocalScale(0, 0, 0)
}, PowerupSphere.prototype.update = function(e) {
    if (this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED) {
        var t;
        if (e *= Helper.game.timeScale, Utils.lastSecond(this._time) ? (this.visual[0].enabled = !0, this.visual[1].enabled = !0) : (this.visual[0].enabled = !1, this.visual[1].enabled = !1), this._time > 0 && this._time - e <= 0)
            for (this._spheres = 0, t = 0; t < this._angles.length; t++) this._tweens[t] = Utils.scaleBounce(this.visual[t], this.visual[t].getLocalScale().x, 0, .8), Helper.level._grid.removeProjectile(this.visual[t].script.actor.id);
        else
            for (t = 0; t < this._angles.length; t++) {
                this._angles[t] += this.speed * e, this._angles[t] >= 2 * Math.PI && (this._angles[t] -= 2 * Math.PI);
                var s = Math.cos(this._angles[t]) * this.radius,
                    i = Math.sin(this._angles[t]) * this.radius;
                this.visual[t].setLocalPosition(s, .5, i)
            }
        this._time -= e
    }
};
var TriggerType = {
        SMOKE: "smoke"
    },
    Trigger = pc.createScript("trigger");
Trigger.attributes.add("type", {
    type: "string",
    enum: [{
        SMOKE: "smoke"
    }]
}), Trigger.prototype.initialize = function() {
    this.entity.on("pool_spawn", this.onSpawn, this), this.entity.on("pool_despawn", this.onDespawn, this), this._drawGizmo = !1, this.ownerId = null
}, Trigger.prototype.onSpawn = function(t) {
    this.ownerId = t, Helper.level._grid.attachTrigger(this.entity)
}, Trigger.prototype.onDespawn = function() {
    this.ownerId = null, Helper.level._grid.removeTrigger(this.entity.script.actor.id)
}, Trigger.prototype.update = function(t) {
    Gizmo.circle(this.entity.getPosition(), this.entity.script.colliderCircle.radius, 16, Gizmo.GREEN_GIZMO)
};
var PowerupSmoke = pc.createScript("powerupSmoke");
PowerupSmoke.attributes.add("triggerPoolId", {
    type: "string"
}), PowerupSmoke.attributes.add("smokeTime", {
    type: "number"
}), PowerupSmoke.attributes.add("triggerTime", {
    type: "number"
}), PowerupSmoke.prototype.manualInit = function() {
    this._time = 0, this._triggerTime = 0, this._slowdownTime = 0, this.entity.script.skinComponent._skin.smokeFx.particlesystem.stop()
}, PowerupSmoke.prototype.launch = function() {
    this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (this._time = this.smokeTime, this.entity.script.skinComponent._skin.smokeFx.particlesystem.play())
}, PowerupSmoke.prototype.turnOff = function() {
    this._time = 0, this.entity.script.skinComponent._skin.smokeFx.particlesystem.stop(), this._triggerTime = 0
}, PowerupSmoke.prototype.slowdown = function() {
    this._slowdownTime = 2
}, PowerupSmoke.prototype.update = function(t) {
    this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (t *= Helper.game.timeScale, Utils.lastSecond(this._time) ? this.entity.script.skinComponent._skin.smokeFx.particlesystem.play() : this.entity.script.skinComponent._skin.smokeFx.particlesystem.stop(), this._time > 0 ? (this._triggerTime += t, this._triggerTime >= this.triggerTime && (Helper.pool.spawn(this.triggerPoolId, this.entity.script.skinComponent._skin.smokeFx.getPosition(), this.entity.script.actor.id), this._triggerTime = 0)) : (this.entity.script.skinComponent._skin.smokeFx.particlesystem.stop(), this._triggerTime = 0), this._slowdownTime -= t, this._time -= t)
};
var ShaderFrensel = pc.createScript("shaderFrensel");
ShaderFrensel.attributes.add("vs", {
    type: "asset",
    assetType: "shader",
    title: "Vertex Shader"
}), ShaderFrensel.attributes.add("fs", {
    type: "asset",
    assetType: "shader",
    title: "Fragment Shader"
}), ShaderFrensel.attributes.add("blendMode", {
    type: "number",
    enum: [{
        additive: 1
    }, {
        normal: 2
    }, {
        none: 3
    }, {
        mult: 5
    }, {
        additive_alpha: 6
    }]
}), ShaderFrensel.attributes.add("heightMap", {
    type: "asset"
}), ShaderFrensel.attributes.add("color", {
    type: "rgb",
    title: "Base Color"
}), ShaderFrensel.attributes.add("color2", {
    type: "rgb",
    title: "Hyperspace Color"
}), ShaderFrensel.attributes.add("multiply", {
    type: "number"
}), ShaderFrensel.attributes.add("alphaMultiplier", {
    type: "number",
    title: "Alpha mult"
}), ShaderFrensel.attributes.add("frensel_dot_mult", {
    type: "number",
    title: "frensel dot mult"
}), ShaderFrensel.attributes.add("frensel_power", {
    type: "vec2",
    title: "frensel exponent"
}), ShaderFrensel.attributes.add("frensel_power_speed", {
    type: "number",
    title: "blinking speed"
}), ShaderFrensel.attributes.add("static_view_dir", {
    type: "vec3",
    title: "frensel viewdir"
}), ShaderFrensel.prototype.getShaderInstance = function() {
    var e = this.color,
        t = this.color2;
    if (this._cached) return {
        color: e,
        color2: t,
        material: this._cached,
        time: 0,
        injectMeshInsance: function(e) {
            this.meshInstances = e
        },
        update: function() {
            for (var e in this.meshInstances) {
                this.meshInstances[e].setParameter("uTime", this.time), this.meshInstances[e].setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), this.meshInstances[e].setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), this.meshInstances[e].setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]);
                var t = Helper.camera.entity.getPosition();
                this.meshInstances[e].setParameter("uCameraPosition", [t.x, t.y, t.z])
            }
        }
    };
    var r = Helper.createMaterial(this.vs, this.fs, "ShaderFrensel");
    r.alphaWrite = !0, r.depthTest = !0, r.cull = pc.CULLFACE_NONE, r.blendType = this.blendMode, r.setParameter("uHeightMap", this.heightMap.resource), r.setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), r.setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), r.setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), r.setParameter("multiply", this.multiply), r.setParameter("alphaMultiplier", this.alphaMultiplier), r.setParameter("frensel_dot_mult", this.frensel_dot_mult), r.setParameter("frensel_power", [this.frensel_power.x, this.frensel_power.y]), r.setParameter("static_view_dir", [this.static_view_dir.x, this.static_view_dir.y, this.static_view_dir.z]);
    var s = {
        color: e,
        color2: t,
        material: r,
        time: 0,
        injectMeshInsance: function(e) {
            this.meshInstances = e
        },
        update: function() {
            for (var e in this.meshInstances) {
                this.meshInstances[e].setParameter("uTime", this.time), this.meshInstances[e].setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), this.meshInstances[e].setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), this.meshInstances[e].setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]);
                var t = Helper.camera.entity.getPosition();
                this.meshInstances[e].setParameter("uCameraPosition", [t.x, t.y, t.z])
            }
        }
    };
    return this._cached = r, s
}, ShaderFrensel.prototype.initShader = function() {
    if (!0 !== this.shaderInited) {
        this.time = 0, this.shaderInited = !0;
        var e = this.app.graphicsDevice,
            t = this.vs.resource,
            r = "precision " + e.precision + " float;\n";
        r += this.fs.resource;
        var s = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION,
                aColor: pc.SEMANTIC_COLOR,
                aNormal: pc.SEMANTIC_NORMAL,
                aUv0: pc.SEMANTIC_TEXCOORD0
            },
            vshader: t,
            fshader: r
        };
        this.shader = new pc.Shader(e, s), this.material = new pc.Material, this.material.name = "ShaderFrensel", this.material.shader = this.shader, this.material.cull = pc.CULLFACE_NONE, this.material.chunks = {}, this.material.depthTest = !0, this.material.depthWrite = !0, this.material.blendType = this.blendMode, this.material.setParameter("uHeightMap", this.heightMap.resource), this.material.setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), this.material.setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), this.material.setParameter("uMapBound", [Helper.level.metersWidth, Helper.level.metersHeight]), this.material.setParameter("multiply", this.multiply), this.material.setParameter("alphaMultiplier", this.alphaMultiplier), this.material.setParameter("frensel_dot_mult", this.frensel_dot_mult), this.material.setParameter("frensel_power", [this.frensel_power.x, this.frensel_power.y]), this.material.setParameter("static_view_dir", [this.static_view_dir.x, this.static_view_dir.y, this.static_view_dir.z])
    }
}, ShaderFrensel.prototype.update = function(e) {
    if (this._cached) {
        var t = this._cached;
        if (Helper.params.realDebug) {
            t.blendType = this.blendMode, t.setParameter("baseColor", [this.color.r, this.color.g, this.color.b]), t.setParameter("hyperColor", [this.color2.r, this.color2.g, this.color2.b]), t.setParameter("multiply", this.multiply), t.setParameter("alphaMultiplier", this.alphaMultiplier), t.setParameter("frensel_dot_mult", this.frensel_dot_mult), t.setParameter("frensel_power", [this.frensel_power.x, this.frensel_power.y]), t.setParameter("static_view_dir", [this.static_view_dir.x, this.static_view_dir.y, this.static_view_dir.z]);
            var r = Helper.camera.entity.getPosition();
            t.setParameter("uCameraPosition", [r.x, r.y, r.z])
        }
    }
};
var PowerupShooter = pc.createScript("powerupShooter");
PowerupShooter.attributes.add("shooterTime", {
    type: "number"
}), PowerupShooter.attributes.add("projectilePoolId", {
    type: "string"
}), PowerupShooter.attributes.add("projectileSpeed", {
    type: "number"
}), PowerupShooter.attributes.add("projectileRadius", {
    type: "number"
}), PowerupShooter.attributes.add("projectileCooldown", {
    type: "number"
}), PowerupShooter.attributes.add("projectileAngleConstrain", {
    type: "number"
}), PowerupShooter.prototype.manualInit = function() {
    this._time = 0, this._cooldown = 0, this._upscaleTween = null, this._downScaleTween = null, this.entity.script.skinComponent._skin.gunVisual.setLocalScale(0, 0, 0), this._selfDirV = new pc.Vec3, this._closestV = new pc.Vec3, this._stillQuat = (new pc.Quat).setFromEulerAngles(0, 180, 0), this._nextQuat = new pc.Quat
}, PowerupShooter.prototype.launchEndless = function() {
    this.shooterTime = 999, this.launch()
}, PowerupShooter.prototype.launch = function() {
    this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED && (this._time > 0 ? this._time = this.shooterTime : (this._time = this.shooterTime, this._cooldown = 0, this.entity.script.skinComponent._skin.gunVisual.setLocalRotation(this._stillQuat), this.entity.script.skinComponent._skin.gunVisualBunny.setLocalRotation(this._stillQuat), this._downScaleTween && (this._downScaleTween.kill(), this._downScaleTween = this._upscaleTween = null), this._upscaleTween = Utils.scaleBounce(this.entity.script.skinComponent._skin.gunVisual, 0, .6, 1)))
}, PowerupShooter.prototype.turnOff = function() {
    this._downScaleTween && (this._downScaleTween.kill(), this._downScaleTween = null), this._upscaleTween && (this._upscaleTween.kill(), this._upscaleTween = null), this._time = 0, this._cooldown = 0, this.entity.script.skinComponent._skin.gunVisual.setLocalScale(0, 0, 0)
}, PowerupShooter.prototype.update = function(t) {
    if (this.entity.script.player._state != PlayerState.DESTROYING && this.entity.script.player._state != PlayerState.DESTROYED) {
        if (t *= Helper.game.timeScale, Utils.lastSecond(this._time) ? this.entity.script.skinComponent._skin.gunVisual.enabled = !0 : this.entity.script.skinComponent._skin.gunVisual.enabled = !1, this._time > 0 && this._time - t <= 0) this._upscaleTween && (this._upscaleTween.kill(), this._upscaleTween = null), this._downScaleTween = Utils.scaleBounce(this.entity.script.skinComponent._skin.gunVisual, .6, 0, 1);
        else if (this._time > 0) {
            for (var e = this.entity.getPosition(), i = Helper.ai.current, n = -1, s = 9999, o = 0; o < i.length; o++) {
                var l = i[o];
                if (l.script.actor.id !== this.entity.script.actor.id) {
                    var a = e.distance(l.getPosition());
                    a < s && (s = a, n = o)
                }
            }
            var r, c = this.entity.script.skinComponent._skin.gunVisual.getLocalRotation();
            if (n > -1 && n < this.projectileRadius) {
                var p = i[n].getPosition();
                if (this.entity.script.skinComponent._skin.rotationRoot.getLocalRotation().transformVector(pc.Vec3.BACK, this._selfDirV).normalize(), this._closestV.set(e.x - p.x, 1, e.z - p.z).normalize(), Gizmo.circle(p, 3, 15, Gizmo.YELLOW_GIZMO), Gizmo.line(p, p.clone().add(this._closestV.scale(5)), Gizmo.YELLOW_GIZMO), Gizmo.line(e, e.clone().add(this._selfDirV.scale(5)), Gizmo.YELLOW_GIZMO), this._selfDirV.normalize(), this._closestV.normalize(), this._selfDirV.dot(this._closestV) < -.85) {
                    if (this.entity.script.skinComponent._skin.gunVisualBunny.lookAt(p.x, p.y, p.z), r = this.entity.script.skinComponent._skin.gunVisualBunny.getLocalRotation(), this._nextQuat = this._nextQuat.slerp(c, r, .025), this._cooldown -= t, this._cooldown <= 0) {
                        this._cooldown = this.projectileCooldown;
                        var u = this.entity.script.skinComponent._skin.gunVisual.getRotation().transformVector(pc.Vec3.FORWARD);
                        Helper.pool.spawn(this.projectilePoolId, this.entity.script.skinComponent._skin.projectileSpawn.getPosition(), this.entity, u).setRotation(this.entity.script.skinComponent._skin.gunVisual.getRotation().mul((new pc.Quat).setFromAxisAngle(pc.Vec3.UP, 180))), SFX.playVariance("projectile", this.entity)
                    }
                } else this.entity.script.skinComponent._skin.gunVisualBunny.setLocalEulerAngles(0, 180, 0), r = this.entity.script.skinComponent._skin.gunVisualBunny.getLocalRotation(), this._nextQuat = this._nextQuat.slerp(c, r, .01)
            } else this.entity.script.skinComponent._skin.gunVisualBunny.setLocalEulerAngles(0, 180, 0), r = this.entity.script.skinComponent._skin.gunVisualBunny.getLocalRotation(), this._nextQuat = this._nextQuat.slerp(c, r, .01);
            this.entity.script.skinComponent._skin.gunVisual.setLocalRotation(this._nextQuat)
        }
        this._time -= t
    }
};
var ProjectileShooter = pc.createScript("projectileShooter");
ProjectileShooter.attributes.add("speed", {
    type: "number"
}), ProjectileShooter.prototype.initialize = function() {
    this.entity.on("pool_spawn", this.onSpawn, this), this.entity.on("pool_despawn", this.onDespawn, this), this._activeShooting = !1
}, ProjectileShooter.prototype.onSpawn = function(t, e) {
    Helper.level._grid.attachProjectile(this.entity), this._activeShooting = !0, this.entity.script.actor.owner = t, this._direction = e
}, ProjectileShooter.prototype.onDespawn = function() {
    Helper.level._grid.removeProjectile(this.entity.script.actor.id), this.entity.script.actor.owner = null, this._activeShooting = !1
}, ProjectileShooter.prototype.update = function(t) {
    if (this._activeShooting && !Helper.reloading) {
        t *= Helper.game.timeScale;
        var e = this.entity.getPosition(),
            i = e.x + this._direction.x * t * this.speed,
            o = e.z + this._direction.z * t * this.speed;
        this.entity.setPosition(i, e.y, o)
    }
};
var Skin = pc.createScript("skin");
Skin.attributes.add("rotationRoot", {
    type: "entity"
}), Skin.attributes.add("tiltRoot", {
    type: "entity"
}), Skin.attributes.add("trails", {
    type: "entity",
    array: !0
}), Skin.attributes.add("wheelFx", {
    type: "entity",
    array: !0
}), Skin.attributes.add("nitroFx", {
    type: "entity",
    array: !0
}), Skin.attributes.add("smokeFx", {
    type: "entity"
}), Skin.attributes.add("lanceRoot", {
    type: "entity"
}), Skin.attributes.add("lanceVisual", {
    type: "entity"
}), Skin.attributes.add("lanceLineEnd", {
    type: "entity"
}), Skin.attributes.add("hullVisual", {
    type: "entity"
}), Skin.attributes.add("crown", {
    type: "entity"
}), Skin.attributes.add("pilotVisual", {
    type: "entity"
}), Skin.attributes.add("shieldVisual", {
    type: "entity"
}), Skin.attributes.add("collider", {
    type: "entity",
    array: !0
}), Skin.attributes.add("enlargerVisual", {
    type: "entity"
}), Skin.attributes.add("gunVisual", {
    type: "entity"
}), Skin.attributes.add("gunVisualBunny", {
    type: "entity"
}), Skin.attributes.add("projectileSpawn", {
    type: "entity"
}), Skin.prototype.prepareForShop = function(t) {
    this._shader = Helper.game.shaders.findByName("hover").script.shaderMatcap.getShaderInstance(), this.hullVisual.model.meshInstances[0].material = this._shader.material, this.lanceVisual.model.meshInstances[0].material = this._shader.material, this._shader.injectMeshInsance([this.hullVisual.model.meshInstances[0], this.lanceVisual.model.meshInstances[0]]);
    var e = -1;
    if (Inventory[t]) e = Inventory[t][0];
    else
        for (var i = TablePurchases.items[t], a = 0; a < i.palette.length; a++)
            if (0 === i.palette[a].coinToUnlock) {
                e = a;
                break
            }
    this._shader.paletteSample = [.125 * e, .5], this._shader.dissolve = 0, this._shader.update(), this.crown.enabled = !1, this.pilotVisual.enabled = !1, this.shieldVisual.enabled = !1, this.gunVisual.enabled = !1, this.enlargerVisual.enabled = !1
}, Skin.prototype.turnOnWheels = function() {
    for (var t = 0; t < this.wheelFx.length; t++) this.wheelFx[t].particlesystem.play()
}, Skin.prototype.turnOffWheels = function() {
    for (var t = 0; t < this.wheelFx.length; t++) this.wheelFx[t].particlesystem.stop()
}, Skin.prototype.turnOnNitro = function() {
    for (var t = 0; t < this.nitroFx.length; t++) this.nitroFx[t].particlesystem.play()
}, Skin.prototype.turnOffNitro = function() {
    for (var t = 0; t < this.nitroFx.length; t++) this.nitroFx[t].particlesystem.stop()
}, Skin.prototype.turnOnTrails = function() {
    for (var t = 0; t < this.trails.length; t++) this.trails[t].enabled = !0
}, Skin.prototype.turnOffTrails = function() {
    for (var t = 0; t < this.trails.length; t++) this.trails[t].enabled = !0
}, Skin.prototype.spearID = function() {
    return this.lanceRoot.actor.id
};
var SkinComponent = pc.createScript("skinComponent");
SkinComponent.attributes.add("hover_catfish", {
    type: "asset"
}), SkinComponent.attributes.add("hover_destroyer", {
    type: "asset"
}), SkinComponent.attributes.add("hover_explorer", {
    type: "asset"
}), SkinComponent.attributes.add("hover_racer", {
    type: "asset"
}), SkinComponent.attributes.add("hover_spider", {
    type: "asset"
}), SkinComponent.attributes.add("hover_spy", {
    type: "asset"
}), SkinComponent.attributes.add("hover_tank", {
    type: "asset"
}), SkinComponent.prototype.getSkin = function() {
    return this._skin || (this._skin = this._findSkin()), this._skin
}, SkinComponent.prototype._findSkin = function() {
    for (var t = 0; t < this.entity.children.length; t++) {
        var e = this.entity.children[t];
        if (e.script.skin) return e.script.skin
    }
}, SkinComponent.prototype.attachToGrid = function() {
    Helper.level._grid.attachHull(this.entity), Helper.level._grid.attachSpear(this._skin.lanceRoot)
}, SkinComponent.prototype.detachFromGrid = function() {
    Helper.level._grid.removeHull(this.entity.script.actor.id), Helper.level._grid.removeSpear(this._skin.lanceRoot.script.actor.id)
}, SkinComponent.prototype.setSkinColor = function(t) {
    this._shader.paletteSample = [.125 * t, .5], this._shader.update()
}, SkinComponent.prototype.setSkin = function(t, e) {
    this._skin && (this.detachFromGrid(), this._skin.entity.destroy(), this._skin = null);
    var i = this[t].resource.instantiate();
    this.entity.addChild(i), this._skin = i.script.skin, this.entity.script.colliderPolygon.points = this._skin.collider, this.entity.script.aabb.updateFromEntity(), this._skin.lanceRoot.script.owner = this.entity, this._skin.lanceRoot.script.spear.owner = this.entity, this._isset = !1, this._shader = Helper.game.shaders.findByName("hover").script.shaderMatcap.getShaderInstance(), this._skin.hullVisual.model.meshInstances[0].material = this._shader.material, this._skin.lanceVisual.model.meshInstances[0].material = this._shader.material, this._shader.injectMeshInsance([this._skin.hullVisual.model.meshInstances[0], this._skin.lanceVisual.model.meshInstances[0]]), this.entity.script.actor.generatedGUID ? this._shader.paletteSample = [pc.math.random(.13, 1), .5] : this._shader.paletteSample = [.125 * e, .5], this._shader.update(), this._shader2 = Helper.game.shaders.findByName("pilot").script.shaderMatcap.getShaderInstance(), this._skin.pilotVisual.model.meshInstances[0].material = this._shader2.material, this._shader2.injectMeshInsance([this._skin.pilotVisual.model.meshInstances[0]]), this._shader2.update(), this.entity.script.actor.initialize(), this._skin.lanceRoot.script.actor.initialize(), this._skin.crown.setLocalScale(0, 0, 0), this.entity.script.powerupShooter.manualInit(), this.entity.script.powerupSmoke.manualInit(), this.entity.script.shield.manualInit()
}, SkinComponent.prototype.attachSkin = function() {}, SkinComponent.prototype.postUpdate = function() {
    this._skin && (this._isset || (this._isset = !0))
};
var Composition = {
        NONE: "none",
        MAIN_MENU: "mainMenu",
        SHOP: "shop",
        LEADERBOARD: "leaderboard"
    },
    Compositions = pc.createScript("compositions");
Compositions.attributes.add("mainMenu", {
    type: "json",
    schema: [{
        name: "profileMoney",
        type: "entity"
    }, {
        name: "levelIndicatorRoot",
        type: "entity"
    }, {
        name: "buttonPlay",
        type: "entity"
    }, {
        name: "buttonShop",
        type: "entity"
    }, {
        name: "buttonLeaderboard",
        type: "entity"
    }, {
        name: "buttonSkipLevel",
        type: "entity"
    }]
}), Compositions.attributes.add("shop", {
    type: "json",
    schema: [{
        name: "profileMoney",
        type: "entity"
    }, {
        name: "buttonBack",
        type: "entity"
    }, {
        name: "buttonLeft",
        type: "entity"
    }, {
        name: "buttonRight",
        type: "entity"
    }, {
        name: "paletteRoot",
        type: "entity"
    }]
}), Compositions.attributes.add("pauseButton", {
    type: "entity"
}), Compositions.attributes.add("fade", {
    type: "entity"
}), Compositions.prototype.showFade = function() {
    this.fade.element.opacity > 0 || Utils.opacityBounce(this.fade.element, 0, .22, .8)
}, Compositions.prototype.hideFade = function() {
    this.fade.element.opacity < .001 || Utils.opacityBounce(this.fade.element, .22, 0, .8)
}, Compositions.prototype.initialize = function() {
    this.current = Composition.NONE, this.mainMenu.buttonShop.element.on("click", (function() {
        this.switchTo(Composition.SHOP), Helper.camera.applyLevel(Helper.camera.shopSequenceHeight)
    }), this), Inventory.sound ? (this.mainMenu.buttonLeaderboard.children[0].enabled = !0, this.mainMenu.buttonLeaderboard.children[1].enabled = !1) : (this.mainMenu.buttonLeaderboard.children[0].enabled = !1, this.mainMenu.buttonLeaderboard.children[1].enabled = !0), this.mainMenu.buttonLeaderboard.element.on("click", (function() {
        var e = !Inventory.sound;
        e ? (this.mainMenu.buttonLeaderboard.children[0].enabled = !0, this.mainMenu.buttonLeaderboard.children[1].enabled = !1, Inventory.sound = e, SFX.menuReturnEngine()) : (SFX.menuFadeEngine(), this.mainMenu.buttonLeaderboard.children[0].enabled = !1, this.mainMenu.buttonLeaderboard.children[1].enabled = !0, Inventory.sound = e), Inventory.save()
    }), this), this.pauseButton.element.on("click", (function() {
        Helper.popupPause.show()
    }), this)
}, Compositions.prototype.switchTo = function(e) {
    var t = this.current,
        n = e;
    if (t !== n) {
        var o, i;
        if (e === Composition.SHOP ? SFX.menuFadeEngine() : e === Composition.MAIN_MENU && SFX.menuReturnEngine(), t !== Composition.NONE)
            for (o in this[t]) n !== Composition.NONE && this[n][o] || (i = this[t][o]).enabled && i.script.tween.playReverse();
        if (n !== Composition.NONE)
            for (o in this[n]) t !== Composition.NONE && this[t][o] || (i = this[n][o]).enabled && i.script.tween.play();
        this.current = n, this.entity.fire("composition_switch", t, n)
    } else console.warn("Trying to switch into same composition - not allowed")
};
var ScreenShop = pc.createScript("screenShop");
ScreenShop.attributes.add("buttonLeft", {
    type: "entity"
}), ScreenShop.attributes.add("buttonRight", {
    type: "entity"
}), ScreenShop.attributes.add("buttonSelect", {
    type: "entity"
}), ScreenShop.attributes.add("buttonBack", {
    type: "entity"
}), ScreenShop.attributes.add("paletteRoot", {
    type: "entity"
}), ScreenShop.attributes.add("palettePrefab", {
    type: "asset"
}), ScreenShop.attributes.add("paletteUnlocked", {
    type: "rgb"
}), ScreenShop.attributes.add("paletteLocked", {
    type: "rgb"
}), ScreenShop.attributes.add("paletteSelected", {
    type: "rgb"
}), ScreenShop.attributes.add("skinSpacing", {
    type: "number"
}), ScreenShop.attributes.add("buyPanelRoot", {
    type: "entity"
}), ScreenShop.attributes.add("buySoft", {
    type: "entity"
}), ScreenShop.attributes.add("buyHard", {
    type: "entity"
}), ScreenShop.attributes.add("buyReturn", {
    type: "entity"
}), ScreenShop.attributes.add("iconAzerion", {
    type: "asset"
}), ScreenShop.attributes.add("iconSocial", {
    type: "asset"
}), ScreenShop.prototype.initialize = function() {
    this.entity.on("composition_switch", this.onSwitch, this), this._paletteElements = [];
    for (var e = this, t = 0; t < Helper.game.palette.length; t++) {
        var n = this.palettePrefab.resource.instantiate();
        this.paletteRoot.addChild(n), n.element.injectedIndex = t, n.children[1].element.color = Helper.game.palette[t], n.element.on("click", (function() {
            e.isColorAvailable(this.injectedIndex) ? (e._buyPanelPresent && e.hideBuyPanel(), Utils.scaleBounce(this.entity, .85, 1, .45), Helper.playerE.script.skinComponent.setSkinColor(this.injectedIndex), Inventory.selectedColor = this.injectedIndex, Inventory.save(), e.updateControls(), Platform.userProperty({
                color: this.injectedIndex
            })) : (Utils.scaleBounce(this.entity, .85, 1, .45), e.showBuyPanel("color", this.injectedIndex), Helper.playerE.script.skinComponent.setSkinColor(this.injectedIndex))
        })), this._paletteElements.push(n)
    }
    for (var s in this._active = !1, this._time = 0, this._buyColorPresent = !1, this._skins = [], this._skinsVisuals = [], TablePurchases.items) {
        this._skins.push(s);
        var i = Helper.playerE.script.skinComponent[s].resource.instantiate();
        Helper.playerE.addChild(i), i.script.skin.prepareForShop(s), i.enabled = !1, this._skinsVisuals.push(i)
    }
    this._inventoryIndex = this._skins.indexOf(Inventory.selectedHover), this._selectedIndex = this._skins.indexOf(Inventory.selectedHover), this._previousIndex = this._selectedIndex, this.tween = null, this.tween2 = null, this.buyReturn.element.on("click", this.hideBuyPanel, this), this.buySoft.element.on("click", (function() {
        this.onBuy("soft")
    }), this), this.buyHard.element.on("click", (function() {
        this.onBuy("hard")
    }), this), this.buttonBack.element.on("click", (function() {
        this._active && (this.stopRotateTween(), Helper.compositions.switchTo(Composition.MAIN_MENU), Helper.camera.applyLevel(Helper.camera.startSequenceHeight))
    }), this), this.buttonLeft.element.on("click", (function() {
        if (this.buttonLeft.button.active) {
            this.tween && this.tween.kill(), this.stopRotateTween(), this._previousIndex = this._selectedIndex, this._selectedIndex -= 1, this.updateControls(), this.startRotateTween();
            this._inventoryIndex;
            var n = this._inventoryIndex - this._selectedIndex,
                s = {
                    value: 0
                };
            this.tween = gsap.to(s, {
                value: this.skinSpacing,
                duration: .3,
                ease: "back.out(1.2)",
                onUpdate: function() {
                    for (t = 0; t < e._skinsVisuals.length; t++) {
                        var i = (t - e._inventoryIndex + (n - 1)) * e.skinSpacing;
                        t === e._inventoryIndex ? Helper.playerE.script.skinComponent._skin.entity.setLocalPosition(0, 0, -1 * (i + s.value)) : e._skinsVisuals[t].setLocalPosition(0, 0, -1 * (i + s.value))
                    }
                }
            })
        }
    }), this), this.buttonRight.element.on("click", (function() {
        if (this.buttonRight.button.active) {
            this.tween && this.tween.kill(), this.stopRotateTween(), this._previousIndex = this._selectedIndex, this._selectedIndex += 1, this.updateControls(), this.startRotateTween();
            this._inventoryIndex;
            var n = this._selectedIndex - this._inventoryIndex,
                s = {
                    value: 0
                };
            this.tween = gsap.to(s, {
                value: this.skinSpacing,
                duration: .3,
                ease: "back.out(1.2)",
                onUpdate: function() {
                    for (t = 0; t < e._skinsVisuals.length; t++) {
                        var i = (e._inventoryIndex - t + (n - 1)) * e.skinSpacing;
                        t === e._inventoryIndex ? Helper.playerE.script.skinComponent._skin.entity.setLocalPosition(0, 0, i + s.value) : e.isSkinAvailable.call(e, t) ? e._skinsVisuals[t].setLocalPosition(0, 0, i + s.value) : e._skinsVisuals[t].setLocalPosition(-.3, 0, i + s.value)
                    }
                }
            })
        }
    }), this), Platform.current === PlatformEnum.AZERION ? this.buttonSelect.children[0].element.sprite = this.iconAzerion.resource : this.buttonSelect.children[0].element.sprite = this.iconSocial.resource, this.buttonSelect.element.on("click", (function() {
        if (this.buttonSelect.button.active)
            if (this.isSkinAvailable(this._selectedIndex)) this.selectAvailableHover();
            else if (Platform.current === PlatformEnum.AZERION) {
            var e = this._skins[this._selectedIndex];
            this._pendingPurchase = "hover", this._pendingSofCurrency = Currency.FRAG, this._pendingSoftCurrencyValue = TablePurchases.items[e].fragToUnlock, this._pendingSelectedItemIdx = this._selectedIndex, this.onBuy("soft")
        } else this.showBuyPanel("hover", this._selectedIndex)
    }), this)
}, ScreenShop.prototype.isColorAvailable = function(e) {
    return Inventory[Inventory.selectedHover].indexOf(e) > -1
}, ScreenShop.prototype.isSkinAvailable = function(e) {
    return Inventory.hovers.indexOf(this._skins[e]) > -1
}, ScreenShop.prototype.setBuyPanelActive = function(e) {
    this.buyReturn.button.active = e, this.buySoft.button.active = e, this.buyHard.button.active = e
}, ScreenShop.prototype.completeColorPurchase = function() {
    Inventory.selectedColor = this._pendingSelectedItemIdx, Helper.playerE.script.skinComponent.setSkinColor(this._pendingSelectedItemIdx), Inventory[Inventory.selectedHover].push(this._pendingSelectedItemIdx), this.hideBuyPanel(), Inventory.save()
}, ScreenShop.prototype.selectAvailableHover = function() {
    this.stopRotateTween(), Inventory.selectedHover = this._skins[this._selectedIndex];
    var e = Inventory[Inventory.selectedHover][0];
    Helper.playerE.script.skinComponent.setSkin(Inventory.selectedHover, e), Inventory.selectedColor = e, this.rearrangeSkins(), this.startRotateTween(), Helper.playerE.script.pickupReciever.restartTween(), this._time = 1, Inventory.save(), this.updateControls(), Platform.userProperty({
        hover: Inventory.selectedHover,
        color: Inventory.selectedColor
    })
}, ScreenShop.prototype.onBuy = function(e) {
    if (console.log(e), console.log(this._pendingPurchase), console.log(this._pendingSofCurrency), console.log(this._pendingSoftCurrencyValue), console.log(this._pendingHardCurrency), console.log(this._pendingHardCurrencyValue), "soft" === e) {
        if ("color" === this._pendingPurchase && this._pendingSoftCurrencyValue <= Inventory.coins && (Inventory.coins -= this._pendingSoftCurrencyValue, Helper.screenProfileMoney.updateMoney(), this.completeColorPurchase(), Platform.event("buy-color-soft", {
                event_label: "soft-buy-color",
                event_category: "engagement",
                hover: Inventory.selectedHover,
                color: Inventory.selectedColor
            }), Platform.userProperty({
                color: Inventory.selectedColor
            })), "hover" === this._pendingPurchase && this._pendingSoftCurrencyValue <= Inventory.frags) {
            Inventory.frags -= this._pendingSoftCurrencyValue;
            for (var t = this._skins[this._selectedIndex], n = -1, s = TablePurchases.items[t], i = 0; i < s.palette.length; i++)
                if (0 === s.palette[i].coinToUnlock) {
                    n = i;
                    break
                }
            Inventory.hovers.push(t), Inventory[t] = [n], Helper.screenProfileMoney.updateFrags(), this.hideBuyPanel(), this.selectAvailableHover(), Platform.event("buy-hover-soft", {
                event_label: "soft-buy-hover",
                event_category: "engagement",
                hover: Inventory.selectedHover,
                color: Inventory.selectedColor
            })
        }
    } else "hard" === e && "color" === this._pendingPurchase && (this.setBuyPanelActive(!1),			
    GAMESDK.showAdOfEvent({
        onRewardBeforeBreak: () => {
            this.setBuyPanelActive(!0), this.updateControls()
            SFX.menuFadeEngine()
        },
        onRewardAfterBreak: () => {
            
            SFX.menuReturnEngine();
        },
        onRewardComplete: () => {
            this.setBuyPanelActive(!0), this.completeColorPurchase(), Platform.userProperty({
                color: Inventory.selectedColor
            })
          
        },
        onRewardDismissed: () => {

        }
    }))
}, ScreenShop.prototype.showBuyPanel = function(e, t) {
    var n;
    if (this._buyPanelPresent = !0, this.buyPanelRoot.script.tween.play(), this.buttonLeft.button.enabled = !1, this.buttonLeft.script.tween.playReverse(), this.buttonRight.button.enabled = !1, this.buttonRight.script.tween.playReverse(), this.buttonSelect.button.enabled = !1, this.buttonSelect.script.tween.playReverse(), this.buttonBack.button.enabled = !1, this.buttonBack.script.tween.playReverse(), this._pendingPurchase = e, "color" === e) {
        n = this._skins[this._selectedIndex];
        var s = TablePurchases.items[n].palette[t].coinToUnlock;
        this._pendingSelectedItemIdx = t, this.buySoft.children[0].enabled = !0, this.buySoft.children[0].children[1].element.text = s, this.buyHard.children[0].enabled = !0, this.buySoft.button.active = Inventory.coins >= s, this.buySoft.children[1].enabled = !1, this.buyHard.children[1].enabled = !1, this._pendingSoftCurrency = Currency.COIN, this._pendingSoftCurrencyValue = s, this._pendingHardCurrency = Currency.REWARDABLE
    } else if ("hover" === e) {
        n = this._skins[this._selectedIndex];
        var i = TablePurchases.items[n].fragToUnlock,
            o = TablePurchases.items[n].oksToUnlock,
            r = TablePurchases.items[n].voicesToUnlock;
        this.buySoft.children[0].enabled = !1, this.buyHard.children[0].enabled = !1, this.buySoft.children[1].enabled = !0, this.buySoft.children[1].children[1].element.text = i, this.buySoft.button.active = Inventory.frags >= i, this.buyHard.children[1].enabled = !0, Platform.current === PlatformEnum.SOCIAL_OK ? (this.buyHard.children[1].children[1].element.text = o, this._pendingHardCurrency = Currency.OK, this._pendingHardCurrencyValue = o) : Platform.current === PlatformEnum.SOCIAL_VK ? (this.buyHard.children[1].children[1].element.text = r, this._pendingHardCurrency = Currency.VOICE, this._pendingHardCurrencyValue = r) : (console.error("unknown platform", Platform.current), this.buyHard.children[1].children[1].element.text = 777), this._pendingSoftCurrency = Currency.FRAG, this._pendingSoftCurrencyValue = i
    } else console.error("unknown kind of purchase: ", e);
    this.updatePalette()
}, ScreenShop.prototype.hideBuyPanel = function() {
    this._buyPanelPresent = !1, Helper.playerE.script.skinComponent.setSkinColor(Inventory.selectedColor), this.buyPanelRoot.script.tween.playReverse(), this.buttonLeft.button.enabled = !0, this.buttonRight.button.enabled = !0, this.buttonSelect.button.enabled = !0, this.buttonBack.button.enabled = !0, this.buttonBack.script.tween.play(), this.updateControls()
}, ScreenShop.prototype.stopRotateTween = function() {
    this.tween2 && this.tween2.kill(), this._inventoryIndex === this._selectedIndex ? Helper.playerE.script.skinComponent._skin.entity.setLocalEulerAngles(0, 120, 0) : this._skinsVisuals[this._selectedIndex].setLocalEulerAngles(0, 120, 0)
}, ScreenShop.prototype.startRotateTween = function() {
    var e = {
            value: 120
        },
        t = this;
    this._inventoryIndex === this._selectedIndex ? this.tween2 = gsap.to(e, {
        value: 480,
        duration: 7,
        repeat: -1,
        ease: "none",
        onUpdate: function() {
            Helper.playerE.script.skinComponent._skin.entity.setLocalEulerAngles(0, e.value, 0)
        }
    }) : this.tween2 = gsap.to(e, {
        value: 480,
        duration: 7,
        repeat: -1,
        ease: "none",
        onUpdate: function() {
            t._skinsVisuals[t._selectedIndex].setLocalEulerAngles(0, e.value, 0)
        }
    })
}, ScreenShop.prototype.updatePalette = function() {
    for (var e = 0; e < this._paletteElements.length; e++) e === this._pendingSelectedItemIdx && this._buyPanelPresent ? this._paletteElements[e].element.color = this.paletteSelected : e !== Inventory.selectedColor || this._buyPanelPresent ? this.isColorAvailable(e) ? (this._paletteElements[e].element.color = this.paletteUnlocked, this._paletteElements[e].children[2].enabled = !1) : (this._paletteElements[e].element.color = this.paletteLocked, this._paletteElements[e].children[2].enabled = !0) : (this._paletteElements[e].element.color = this.paletteSelected, this._paletteElements[e].children[2].enabled = !1)
}, ScreenShop.prototype.updateControls = function() {
    if (0 === this._selectedIndex ? (this.buttonLeft.button.active = !1, this.buttonLeft.script.tween.playReverse()) : (this.buttonLeft.button.active = !0, this.buttonLeft.script.tween.play()), this._selectedIndex === this._skins.length - 1 ? (this.buttonRight.button.active = !1, this.buttonRight.script.tween.playReverse()) : (this.buttonRight.button.active = !0, this.buttonRight.script.tween.play()), this._selectedIndex === this._inventoryIndex) this.buttonSelect.button.active = !1, this.buttonSelect.script.tween.playReverse(), this.buttonSelect.children[0].enabled = !1, this.paletteRoot.script.tween.play(), this.updatePalette();
    else {
        if (this.buttonSelect.button.active = !0, this.buttonSelect.script.tween.play(), this.buttonSelect.children[0].enabled = !this.isSkinAvailable(this._selectedIndex), this.isSkinAvailable(this._selectedIndex)) this.buttonSelect.children[1].element.text = Locale.get("shop_select");
        else if (Platform.current === PlatformEnum.AZERION) {
            var e = this._skins[this._selectedIndex];
            this.buttonSelect.children[1].element.text = TablePurchases.items[e].fragToUnlock, this.buttonSelect.button.active = Inventory.frags >= TablePurchases.items[e].fragToUnlock
        } else this.buttonSelect.button.active = !0, this.buttonSelect.children[1].element.text = Locale.get("shop_buy");
        this.paletteRoot.script.tween.playReverse()
    }
}, ScreenShop.prototype.rearrangeSkins = function() {
    for (i = 0; i < this._skinsVisuals.length; i++) this._skinsVisuals[i].enabled = !1;
    this._inventoryIndex = this._skins.indexOf(Inventory.selectedHover), this._selectedIndex = this._skins.indexOf(Inventory.selectedHover), this._active = !0, this._time = 0, Helper.playerE.script.player.blobShadow.enabled = !1, Helper.playerE.script.player._state = PlayerState.SHOP_IDLE;
    for (var e = this._skins.indexOf(Helper.playerE.script.skinComponent._skin.entity.name), t = e, n = (this._skins.length, 1); n <= t; n++) this._skinsVisuals[e - n].setLocalPosition(0, 0, this.skinSpacing * n), this._skinsVisuals[e - n].enabled = !0;
    for (var s = 1; s < this._skins.length - e; s++) this._skinsVisuals[e + s].setLocalPosition(0, 0, -this.skinSpacing * s), this._skinsVisuals[e + s].enabled = !0;
    this.updateControls()
}, ScreenShop.prototype.onSwitch = function(e, t) {
    e === Composition.SHOP && (this._active = !1, this._time = 1, Helper.playerE.script.player.blobShadow.enabled = !0, Helper.playerE.script.player._state = PlayerState.IDLE, this.buttonSelect.button.active = !1, this.buttonSelect.script.tween.playReverse()), t === Composition.SHOP && (this.rearrangeSkins(), this.startRotateTween())
}, ScreenShop.prototype.update = function(e) {
    var t;
    if (Helper.game.state === GameState.MAIN_MENU || Helper.game.state === GameState.COUNTDOWN)
        if (e *= Helper.game.timeScale, this._active)
            for (this._time += 2 * e, t = 0; t < this._skinsVisuals.length; t++) this._skinsVisuals[t].script.skin._shader.dissolve = pc.math.clamp(1 - this._time, 0, 1), this._skinsVisuals[t].script.skin._shader.update();
        else {
            for (this._time -= 2.5 * e, t = 0; t < this._skinsVisuals.length; t++) this._skinsVisuals[t].script.skin._shader.dissolve = pc.math.clamp(1 - this._time, 0, 1), this._skinsVisuals[t].script.skin._shader.update();
            if (this._time <= 0)
                for (t = 0; t < this._skinsVisuals.length; t++) this._skinsVisuals[t].enabled = !1
        }
};
var FastBase64 = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],
    Init: function() {
        for (var e = 0; e < 4096; e++) this.encLookup[e] = this.chars[e >> 6] + this.chars[63 & e]
    },
    Encode: function(e) {
        for (var a = e.length, t = "", h = 0; a > 2;) n = e[h] << 16 | e[h + 1] << 8 | e[h + 2], t += this.encLookup[n >> 12] + this.encLookup[4095 & n], a -= 3, h += 3;
        if (a > 0) {
            var r = (252 & e[h]) >> 2,
                i = (3 & e[h]) << 4;
            if (a > 1 && (i |= (240 & e[++h]) >> 4), t += this.chars[r], t += this.chars[i], 2 == a) {
                var s = (15 & e[h++]) << 2;
                s |= (192 & e[h]) >> 6, t += this.chars[s]
            }
            1 == a && (t += "="), t += "="
        }
        return t
    }
};
FastBase64.Init();
var RIFFWAVE = function(e) {
    function u32ToArray(e) {
        return [255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]
    }

    function u16ToArray(e) {
        return [255 & e, e >> 8 & 255]
    }
    this.data = [], this.wav = [], this.dataURI = "", this.header = {
        chunkId: [82, 73, 70, 70],
        chunkSize: 0,
        format: [87, 65, 86, 69],
        subChunk1Id: [102, 109, 116, 32],
        subChunk1Size: 16,
        audioFormat: 1,
        numChannels: 1,
        sampleRate: 8e3,
        byteRate: 0,
        blockAlign: 0,
        bitsPerSample: 8,
        subChunk2Id: [100, 97, 116, 97],
        subChunk2Size: 0
    }, this.Make = function(e) {
        e instanceof Array && (this.data = e), this.header.blockAlign = this.header.numChannels * this.header.bitsPerSample >> 3, this.header.byteRate = this.header.blockAlign * this.sampleRate, this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3), this.header.chunkSize = 36 + this.header.subChunk2Size, this.wav = this.header.chunkId.concat(u32ToArray(this.header.chunkSize), this.header.format, this.header.subChunk1Id, u32ToArray(this.header.subChunk1Size), u16ToArray(this.header.audioFormat), u16ToArray(this.header.numChannels), u32ToArray(this.header.sampleRate), u32ToArray(this.header.byteRate), u16ToArray(this.header.blockAlign), u16ToArray(this.header.bitsPerSample), this.header.subChunk2Id, u32ToArray(this.header.subChunk2Size), 16 == this.header.bitsPerSample ? function split16bitArray(e) {
            for (var a = [], t = 0, h = e.length, r = 0; r < h; r++) a[t++] = 255 & e[r], a[t++] = e[r] >> 8 & 255;
            return a
        }(this.data) : this.data), this.dataURI = "data:audio/wav;base64," + FastBase64.Encode(this.wav)
    }, e instanceof Array && this.Make(e)
};
! function(e, a) {
    "function" == typeof define && define.amd ? define([], (function() {
        return e.RIFFWAVE = a()
    })) : "object" == typeof module && module.exports ? module.exports = e.RIFFWAVE = a() : e.RIFFWAVE = a()
}(this, (function() {
    return RIFFWAVE
}));
var SQUARE = 0,
    SAWTOOTH = 1,
    SINE = 2,
    NOISE = 3,
    masterVolume = 1,
    OVERSAMPLING = 8;

function Params() {
    this.oldParams = !0, this.wave_type = SQUARE, this.p_env_attack = 0, this.p_env_sustain = .3, this.p_env_punch = 0, this.p_env_decay = .4, this.p_base_freq = .3, this.p_freq_limit = 0, this.p_freq_ramp = 0, this.p_freq_dramp = 0, this.p_vib_strength = 0, this.p_vib_speed = 0, this.p_arp_mod = 0, this.p_arp_speed = 0, this.p_duty = 0, this.p_duty_ramp = 0, this.p_repeat_speed = 0, this.p_pha_offset = 0, this.p_pha_ramp = 0, this.p_lpf_freq = 1, this.p_lpf_ramp = 0, this.p_lpf_resonance = 0, this.p_hpf_freq = 0, this.p_hpf_ramp = 0, this.sound_vol = .5, this.sample_rate = 44100, this.sample_size = 8
}

function sqr(t) {
    return t * t
}

function cube(t) {
    return t * t * t
}

function sign(t) {
    return t < 0 ? -1 : 1
}

function log(t, e) {
    return Math.log(t) / Math.log(e)
}
var pow = Math.pow;

function frnd(t) {
    return Math.random() * t
}

function rndr(t, e) {
    return Math.random() * (e - t) + t
}

function rnd(t) {
    return Math.floor(Math.random() * (t + 1))
}

function assembleFloat(t, e, r) {
    return t << 31 | e << 23 | r
}

function floatToNumber(t) {
    if (isNaN(t)) return assembleFloat(0, 255, 4919);
    var e = t < 0 ? 1 : 0;
    if (0 == (t = Math.abs(t))) return assembleFloat(e, 0, 0);
    var r = Math.floor(Math.log(t) / Math.LN2);
    return r > 127 || r < -126 ? assembleFloat(e, 255, 0) : assembleFloat(e, r + 127, t / Math.pow(2, r) * Math.pow(2, 23) & 8388607)
}

function numberToFloat(t) {
    var e = 2147483648 & t ? -1 : 1,
        r = (t >> 23 & 255) - 127,
        p = 8388607 & t;
    if (128 == r) return e * (p ? Number.NaN : Number.POSITIVE_INFINITY);
    if (-127 == r) {
        if (0 == p) return 0 * e;
        r = -126, p /= 1 << 22
    } else p = (p | 1 << 23) / (1 << 23);
    return e * p * Math.pow(2, r)
}
var b58alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    params_order = ["wave_type", "p_env_attack", "p_env_sustain", "p_env_punch", "p_env_decay", "p_base_freq", "p_freq_limit", "p_freq_ramp", "p_freq_dramp", "p_vib_strength", "p_vib_speed", "p_arp_mod", "p_arp_speed", "p_duty", "p_duty_ramp", "p_repeat_speed", "p_pha_offset", "p_pha_ramp", "p_lpf_freq", "p_lpf_ramp", "p_lpf_resonance", "p_hpf_freq", "p_hpf_ramp"];

function SoundEffect(t) {
    if ("string" == typeof t) {
        var e = new Params;
        0 == t.indexOf("#") && (t = t.slice(1)), t = e.fromB58(t)
    }
    this.init(t)
}
Params.prototype.toB58 = function() {
    var t = [];
    for (var e in params_order) {
        var r = params_order[e];
        if ("wave_type" == r) t.push(this[r]);
        else if (0 == r.indexOf("p_")) {
            var p = this[r];
            p = floatToNumber(p), t.push(255 & p), t.push(255 & p >> 8), t.push(255 & p >> 16), t.push(255 & p >> 24)
        }
    }
    return function(t, e) {
        var r, p, i, s, n = [],
            a = "";
        for (r in t)
            for (p = 0, a += (i = t[r]) || a.length ^ r ? "" : 1; p in n || i;) i = (s = (s = n[p]) ? 256 * s + i : i) / 58 | 0, n[p] = s % 58, p++;
        for (; p--;) a += e[n[p]];
        return a
    }(t, b58alphabet)
}, Params.prototype.fromB58 = function(t) {
    return this.fromJSON(sfxr.b58decode(t)), this
}, Params.prototype.fromJSON = function(t) {
    for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
    return this
}, Params.prototype.pickupCoin = function() {
    return this.wave_type = SAWTOOTH, this.p_base_freq = .4 + frnd(.5), this.p_env_attack = 0, this.p_env_sustain = frnd(.1), this.p_env_decay = .1 + frnd(.4), this.p_env_punch = .3 + frnd(.3), rnd(1) && (this.p_arp_speed = .5 + frnd(.2), this.p_arp_mod = .2 + frnd(.4)), this
}, Params.prototype.laserShoot = function() {
    return this.wave_type = rnd(2), this.wave_type === SINE && rnd(1) && (this.wave_type = rnd(1)), 0 === rnd(2) ? (this.p_base_freq = .3 + frnd(.6), this.p_freq_limit = frnd(.1), this.p_freq_ramp = -.35 - frnd(.3)) : (this.p_base_freq = .5 + frnd(.5), this.p_freq_limit = this.p_base_freq - .2 - frnd(.6), this.p_freq_limit < .2 && (this.p_freq_limit = .2), this.p_freq_ramp = -.15 - frnd(.2)), this.wave_type === SAWTOOTH && (this.p_duty = 1), rnd(1) ? (this.p_duty = frnd(.5), this.p_duty_ramp = frnd(.2)) : (this.p_duty = .4 + frnd(.5), this.p_duty_ramp = -frnd(.7)), this.p_env_attack = 0, this.p_env_sustain = .1 + frnd(.2), this.p_env_decay = frnd(.4), rnd(1) && (this.p_env_punch = frnd(.3)), 0 === rnd(2) && (this.p_pha_offset = frnd(.2), this.p_pha_ramp = -frnd(.2)), this.p_hpf_freq = frnd(.3), this
}, Params.prototype.explosion = function() {
    return this.wave_type = NOISE, rnd(1) ? (this.p_base_freq = sqr(.1 + frnd(.4)), this.p_freq_ramp = -.1 + frnd(.4)) : (this.p_base_freq = sqr(.2 + frnd(.7)), this.p_freq_ramp = -.2 - frnd(.2)), 0 === rnd(4) && (this.p_freq_ramp = 0), 0 === rnd(2) && (this.p_repeat_speed = .3 + frnd(.5)), this.p_env_attack = 0, this.p_env_sustain = .1 + frnd(.3), this.p_env_decay = frnd(.5), rnd(1) && (this.p_pha_offset = -.3 + frnd(.9), this.p_pha_ramp = -frnd(.3)), this.p_env_punch = .2 + frnd(.6), rnd(1) && (this.p_vib_strength = frnd(.7), this.p_vib_speed = frnd(.6)), 0 === rnd(2) && (this.p_arp_speed = .6 + frnd(.3), this.p_arp_mod = .8 - frnd(1.6)), this
}, Params.prototype.powerUp = function() {
    return rnd(1) ? (this.wave_type = SAWTOOTH, this.p_duty = 1) : this.p_duty = frnd(.6), this.p_base_freq = .2 + frnd(.3), rnd(1) ? (this.p_freq_ramp = .1 + frnd(.4), this.p_repeat_speed = .4 + frnd(.4)) : (this.p_freq_ramp = .05 + frnd(.2), rnd(1) && (this.p_vib_strength = frnd(.7), this.p_vib_speed = frnd(.6))), this.p_env_attack = 0, this.p_env_sustain = frnd(.4), this.p_env_decay = .1 + frnd(.4), this
}, Params.prototype.hitHurt = function() {
    return this.wave_type = rnd(2), this.wave_type === SINE && (this.wave_type = NOISE), this.wave_type === SQUARE && (this.p_duty = frnd(.6)), this.wave_type === SAWTOOTH && (this.p_duty = 1), this.p_base_freq = .2 + frnd(.6), this.p_freq_ramp = -.3 - frnd(.4), this.p_env_attack = 0, this.p_env_sustain = frnd(.1), this.p_env_decay = .1 + frnd(.2), rnd(1) && (this.p_hpf_freq = frnd(.3)), this
}, Params.prototype.jump = function() {
    return this.wave_type = SQUARE, this.p_duty = frnd(.6), this.p_base_freq = .3 + frnd(.3), this.p_freq_ramp = .1 + frnd(.2), this.p_env_attack = 0, this.p_env_sustain = .1 + frnd(.3), this.p_env_decay = .1 + frnd(.2), rnd(1) && (this.p_hpf_freq = frnd(.3)), rnd(1) && (this.p_lpf_freq = 1 - frnd(.6)), this
}, Params.prototype.blipSelect = function() {
    return this.wave_type = rnd(1), this.wave_type === SQUARE ? this.p_duty = frnd(.6) : this.p_duty = 1, this.p_base_freq = .2 + frnd(.4), this.p_env_attack = 0, this.p_env_sustain = .1 + frnd(.1), this.p_env_decay = frnd(.2), this.p_hpf_freq = .1, this
}, Params.prototype.mutate = function() {
    rnd(1) && (this.p_base_freq += frnd(.1) - .05), rnd(1) && (this.p_freq_ramp += frnd(.1) - .05), rnd(1) && (this.p_freq_dramp += frnd(.1) - .05), rnd(1) && (this.p_duty += frnd(.1) - .05), rnd(1) && (this.p_duty_ramp += frnd(.1) - .05), rnd(1) && (this.p_vib_strength += frnd(.1) - .05), rnd(1) && (this.p_vib_speed += frnd(.1) - .05), rnd(1) && (this.p_vib_delay += frnd(.1) - .05), rnd(1) && (this.p_env_attack += frnd(.1) - .05), rnd(1) && (this.p_env_sustain += frnd(.1) - .05), rnd(1) && (this.p_env_decay += frnd(.1) - .05), rnd(1) && (this.p_env_punch += frnd(.1) - .05), rnd(1) && (this.p_lpf_resonance += frnd(.1) - .05), rnd(1) && (this.p_lpf_freq += frnd(.1) - .05), rnd(1) && (this.p_lpf_ramp += frnd(.1) - .05), rnd(1) && (this.p_hpf_freq += frnd(.1) - .05), rnd(1) && (this.p_hpf_ramp += frnd(.1) - .05), rnd(1) && (this.p_pha_offset += frnd(.1) - .05), rnd(1) && (this.p_pha_ramp += frnd(.1) - .05), rnd(1) && (this.p_repeat_speed += frnd(.1) - .05), rnd(1) && (this.p_arp_speed += frnd(.1) - .05), rnd(1) && (this.p_arp_mod += frnd(.1) - .05)
}, Params.prototype.random = function() {
    return this.wave_type = rnd(3), rnd(1) ? this.p_base_freq = cube(frnd(2) - 1) + .5 : this.p_base_freq = sqr(frnd(1)), this.p_freq_limit = 0, this.p_freq_ramp = Math.pow(frnd(2) - 1, 5), this.p_base_freq > .7 && this.p_freq_ramp > .2 && (this.p_freq_ramp = -this.p_freq_ramp), this.p_base_freq < .2 && this.p_freq_ramp < -.05 && (this.p_freq_ramp = -this.p_freq_ramp), this.p_freq_dramp = Math.pow(frnd(2) - 1, 3), this.p_duty = frnd(2) - 1, this.p_duty_ramp = Math.pow(frnd(2) - 1, 3), this.p_vib_strength = Math.pow(frnd(2) - 1, 3), this.p_vib_speed = rndr(-1, 1), this.p_env_attack = cube(rndr(-1, 1)), this.p_env_sustain = sqr(rndr(-1, 1)), this.p_env_decay = rndr(-1, 1), this.p_env_punch = Math.pow(frnd(.8), 2), this.p_env_attack + this.p_env_sustain + this.p_env_decay < .2 && (this.p_env_sustain += .2 + frnd(.3), this.p_env_decay += .2 + frnd(.3)), this.p_lpf_resonance = rndr(-1, 1), this.p_lpf_freq = 1 - Math.pow(frnd(1), 3), this.p_lpf_ramp = Math.pow(frnd(2) - 1, 3), this.p_lpf_freq < .1 && this.p_lpf_ramp < -.05 && (this.p_lpf_ramp = -this.p_lpf_ramp), this.p_hpf_freq = Math.pow(frnd(1), 5), this.p_hpf_ramp = Math.pow(frnd(2) - 1, 5), this.p_pha_offset = Math.pow(frnd(2) - 1, 3), this.p_pha_ramp = Math.pow(frnd(2) - 1, 3), this.p_repeat_speed = frnd(2) - 1, this.p_arp_speed = frnd(2) - 1, this.p_arp_mod = frnd(2) - 1, this
}, Params.prototype.synth = function() {
    this.wave_type = rnd(1), this.p_base_freq = rnd(1) ? .2477 : .1737, this.p_env_attack = rnd(4) > 3 ? frnd(.5) : 0, this.p_env_sustain = frnd(1), this.p_env_punch = frnd(1), this.p_env_decay = frnd(.9) + .1, this.p_arp_mod = [0, 0, 0, 0, -.3162, .7454, .7454][rnd(6)], this.p_arp_speed = frnd(.5) + .4, this.p_duty = frnd(1), this.p_duty_ramp = 2 == rnd(2) ? frnd(1) : 0, this.p_lpf_freq = [1, frnd(1) * frnd(1)][rnd(1)], this.p_lpf_ramp = rndr(-1, 1), this.p_lpf_resonance = frnd(1), this.p_hpf_freq = 3 == rnd(3) ? frnd(1) : 0, this.p_hpf_ramp = 3 == rnd(3) ? frnd(1) : 0
}, Params.prototype.tone = function() {
    return this.wave_type = SINE, this.p_base_freq = .35173364, this.p_env_attack = 0, this.p_env_sustain = .6641, this.p_env_decay = 0, this.p_env_punch = 0, this
}, sfxr = {}, sfxr.toBuffer = function(t) {
    return new SoundEffect(t).getRawBuffer().buffer
}, sfxr.toWebAudio = function(t, e) {
    var r = new SoundEffect(t),
        p = _sfxr_getNormalized(r.getRawBuffer().buffer, r.bitsPerChannel);
    if (e) {
        for (var i = e.createBuffer(1, p.length, r.sampleRate), s = i.getChannelData(0), n = 0; n < p.length; n++) s[n] = p[n];
        var a = e.createBufferSource();
        return a.buffer = i, a
    }
}, sfxr.toWave = function(t) {
    return new SoundEffect(t).generate()
}, sfxr.toAudio = function(t) {
    return new SoundEffect(t).generate().getAudio()
}, sfxr.b58decode = function(t) {
    var e = function(t, e) {
            var r, p, i, s, n = [],
                a = [];
            for (r in t) {
                if (p = 0, (i = e.indexOf(t[r])) < 0) return;
                for (i || a.length ^ r || a.push(0); p in n || i;) i = (s = (s = n[p]) ? 58 * s + i : i) >> 8, n[p] = s % 256, p++
            }
            for (; p--;) a.push(n[p]);
            return new Uint8Array(a)
        }(t, b58alphabet),
        r = {};
    for (var p in params_order) {
        var i = params_order[p],
            s = 4 * (p - 1) + 1;
        if ("wave_type" == i) r[i] = e[0];
        else {
            var n = e[s] | e[s + 1] << 8 | e[s + 2] << 16 | e[s + 3] << 24;
            r[i] = numberToFloat(n)
        }
    }
    return r
}, SoundEffect.prototype.init = function(t) {
    this.parameters = t, this.initForRepeat(), this.waveShape = parseInt(t.wave_type), this.fltw = .1 * Math.pow(t.p_lpf_freq, 3), this.enableLowPassFilter = 1 != t.p_lpf_freq, this.fltw_d = 1 + 1e-4 * t.p_lpf_ramp, this.fltdmp = 5 / (1 + 20 * Math.pow(t.p_lpf_resonance, 2)) * (.01 + this.fltw), this.fltdmp > .8 && (this.fltdmp = .8), this.flthp = .1 * Math.pow(t.p_hpf_freq, 2), this.flthp_d = 1 + 3e-4 * t.p_hpf_ramp, this.vibratoSpeed = .01 * Math.pow(t.p_vib_speed, 2), this.vibratoAmplitude = .5 * t.p_vib_strength, this.envelopeLength = [Math.floor(t.p_env_attack * t.p_env_attack * 1e5), Math.floor(t.p_env_sustain * t.p_env_sustain * 1e5), Math.floor(t.p_env_decay * t.p_env_decay * 1e5)], this.envelopePunch = t.p_env_punch, this.flangerOffset = 1020 * Math.pow(t.p_pha_offset, 2), t.p_pha_offset < 0 && (this.flangerOffset = -this.flangerOffset), this.flangerOffsetSlide = 1 * Math.pow(t.p_pha_ramp, 2), t.p_pha_ramp < 0 && (this.flangerOffsetSlide = -this.flangerOffsetSlide), this.repeatTime = Math.floor(2e4 * Math.pow(1 - t.p_repeat_speed, 2) + 32), 0 === t.p_repeat_speed && (this.repeatTime = 0), this.gain = Math.exp(t.sound_vol) - 1, this.sampleRate = t.sample_rate, this.bitsPerChannel = t.sample_size
}, SoundEffect.prototype.initForRepeat = function() {
    var t = this.parameters;
    this.elapsedSinceRepeat = 0, this.period = 100 / (t.p_base_freq * t.p_base_freq + .001), this.periodMax = 100 / (t.p_freq_limit * t.p_freq_limit + .001), this.enableFrequencyCutoff = t.p_freq_limit > 0, this.periodMult = 1 - .01 * Math.pow(t.p_freq_ramp, 3), this.periodMultSlide = 1e-6 * -Math.pow(t.p_freq_dramp, 3), this.dutyCycle = .5 - .5 * t.p_duty, this.dutyCycleSlide = 5e-5 * -t.p_duty_ramp, t.p_arp_mod >= 0 ? this.arpeggioMultiplier = 1 - .9 * Math.pow(t.p_arp_mod, 2) : this.arpeggioMultiplier = 1 + 10 * Math.pow(t.p_arp_mod, 2), this.arpeggioTime = Math.floor(2e4 * Math.pow(1 - t.p_arp_speed, 2) + 32), 1 === t.p_arp_speed && (this.arpeggioTime = 0)
}, SoundEffect.prototype.getRawBuffer = function() {
    for (var t = 0, e = 0, r = 0, p = Array(32), i = 0; i < 32; ++i) p[i] = 2 * Math.random() - 1;
    var s = 0,
        n = 0,
        a = 0,
        _ = 0,
        h = 0,
        f = Array(1024);
    for (i = 0; i < 1024; ++i) f[i] = 0;
    for (var d = 0, o = [], u = 0, l = 0, m = Math.floor(44100 / this.sampleRate), v = 0; 0 != this.repeatTime && ++this.elapsedSinceRepeat >= this.repeatTime && this.initForRepeat(), 0 != this.arpeggioTime && v >= this.arpeggioTime && (this.arpeggioTime = 0, this.period *= this.arpeggioMultiplier), this.periodMult += this.periodMultSlide, this.period *= this.periodMult, !(this.period > this.periodMax && (this.period = this.periodMax, this.enableFrequencyCutoff)); ++v) {
        var c = this.period;
        this.vibratoAmplitude > 0 && (a += this.vibratoSpeed, c = this.period * (1 + Math.sin(a) * this.vibratoAmplitude));
        var y, w = Math.floor(c);
        if (w < OVERSAMPLING && (w = OVERSAMPLING), this.dutyCycle += this.dutyCycleSlide, this.dutyCycle < 0 && (this.dutyCycle = 0), this.dutyCycle > .5 && (this.dutyCycle = .5), ++n > this.envelopeLength[s] && (n = 0, ++s > 2)) break;
        var b = n / this.envelopeLength[s];
        y = 0 === s ? b : 1 === s ? 1 + 2 * (1 - b) * this.envelopePunch : 1 - b, this.flangerOffset += this.flangerOffsetSlide;
        var q = Math.abs(Math.floor(this.flangerOffset));
        q > 1023 && (q = 1023), 0 != this.flthp_d && (this.flthp *= this.flthp_d, this.flthp < 1e-5 && (this.flthp = 1e-5), this.flthp > .1 && (this.flthp = .1));
        for (var S = 0, M = 0; M < OVERSAMPLING; ++M) {
            var g = 0;
            if (++_ >= w && (_ %= w, this.waveShape === NOISE))
                for (i = 0; i < 32; ++i) p[i] = 2 * Math.random() - 1;
            var O = _ / w;
            if (this.waveShape === SQUARE) g = O < this.dutyCycle ? .5 : -.5;
            else if (this.waveShape === SAWTOOTH) g = O < this.dutyCycle ? 2 * O / this.dutyCycle - 1 : 1 - 2 * (O - this.dutyCycle) / (1 - this.dutyCycle);
            else if (this.waveShape === SINE) g = Math.sin(2 * O * Math.PI);
            else {
                if (this.waveShape !== NOISE) throw "ERROR: Bad wave type: " + this.waveShape;
                g = p[Math.floor(32 * _ / w)]
            }
            var E = t;
            this.fltw *= this.fltw_d, this.fltw < 0 && (this.fltw = 0), this.fltw > .1 && (this.fltw = .1), this.enableLowPassFilter ? (e += (g - t) * this.fltw, e -= e * this.fltdmp) : (t = g, e = 0), r += (t += e) - E, g = r -= r * this.flthp, f[1023 & h] = g, g += f[h - q + 1024 & 1023], h = h + 1 & 1023, S += g * y
        }
        u += S, ++l >= m && (l = 0, S = u / m, u = 0, S = S / OVERSAMPLING * masterVolume, S *= this.gain, 8 === this.bitsPerChannel ? ((S = Math.floor(128 * (S + 1))) > 255 ? (S = 255, ++d) : S < 0 && (S = 0, ++d), o.push(S)) : ((S = Math.floor(32768 * S)) >= 32768 ? (S = 32767, ++d) : S < -32768 && (S = -32768, ++d), o.push(255 & S), o.push(S >> 8 & 255)))
    }
    return {
        buffer: o,
        clipped: d
    }
}, SoundEffect.prototype.generate = function() {
    var t = this.getRawBuffer(),
        e = new RIFFWAVE,
        r = _sfxr_getNormalized(t.buffer, this.bitsPerChannel);
    return e.header.sampleRate = this.sampleRate, e.header.bitsPerSample = this.bitsPerChannel, e.Make(t.buffer), e.clipping = t.clipped, e.buffer = r, e.getAudio = _sfxr_getAudioFn(e), e
};
var _sfxr_getNormalized = function(t, e) {
        for (var r = new Float32Array(t.length), p = 0; p < t.length; p++) r[p] = 2 * t[p] / pow(2, e) - 1;
        return r
    },
    _actx = null,
    _sfxr_getAudioFn = function(t) {
        return function() {
            var e = null;
            if (_actx || ("AudioContext" in window ? _actx = new AudioContext : "webkitAudioContext" in window && (_actx = new webkitAudioContext)), e = _actx) {
                for (var r = e.createBuffer(1, t.buffer.length, t.header.sampleRate), p = r.getChannelData(0), i = 0; i < t.buffer.length; i++) p[i] = t.buffer[i];
                var s = 1,
                    n = {
                        channels: [],
                        setVolume: function(t) {
                            return s = t, n
                        },
                        play: function() {
                            var t = e.createBufferSource();
                            t.buffer = r;
                            var p = e.createGain();
                            p.gain.value = s, p.connect(e.destination), t.connect(p), t.start ? t.start() : t.noteOn && t.noteOn(0), this.channels.push(t)
                        }
                    };
                return n
            }
            var a = new Audio;
            return a.src = t.dataURI, a
        }
    };
! function(t, e) {
    "function" == typeof define && define.amd ? define(["riffwave"], (function(r) {
        return t.jsfxr = e(r)
    })) : "object" == typeof module && module.exports ? (RIFFWAVE = require("./riffwave.js"), module.exports = t.jsfxr = e(RIFFWAVE)) : t.jsfxr = e(t.RIFFWAVE)
}(this, (function(t) {
    return {
        Params: Params,
        SoundEffect: SoundEffect,
        sfxr: sfxr,
        waveforms: {
            SQUARE: SQUARE,
            SAWTOOTH: SAWTOOTH,
            SINE: SINE,
            NOISE: NOISE
        }
    }
}));
var SFX = {
    init: function(t, i) {
        if (!this._loaded) {
            for (var e in this._loaded = !0, this._variants = {}, this._engine = [], this._id = {}, this._current = "", this._volume = 0, t)
                if (e.indexOf("engine") > -1) this._engine.push(e), t[e][2] = !0;
                else {
                    var n = e.split("_");
                    n.splice(n.length - 1), n = n.join("_"), void 0 === this._variants[n] ? this._variants[n] = 1 : this._variants[n] += 1
                }
            this._howl = new Howl({
                src: [i],
                sprite: t
            }), this._howl.once("load", this.menuInitialEngine.bind(this)), this._howl.once("playerror", function() {
                this._howl.once("unlock", this.menuInitialEngine.bind(this))
            }.bind(this))
        }
    },
    getID: function(t) {
        if (this._id[t]) return this._id[t];
        var i = this._howl.play(t);
        return this._howl.volume(0, i), this._id[t] = i, i
    },
    selectVariant: function(t) {
        var i = this._variants[t];
        return t + "_" + Math.floor(pc.math.random(1, i + .1))
    },
    playVariance: function(t, i) {
        if (Inventory.sound) {
            var e = 1;
            if (void 0 !== i) {
                "player" == i.script.actor.id || (e = 1 / (2 * i.getPosition().distance(Helper.playerE.getPosition())));
                var n = this._howl.play(this.selectVariant(t));
                this._howl.volume(e, n)
            } else this._howl.play(this.selectVariant(t))
        }
    },
    menuInitialEngine: function() {
        this._current = "engine_low", Helper.game.state.indexOf("ftue") > -1 ? this._volume = 0 : this._volume = .005, Inventory.sound && this._howl.volume(this._volume, this.getID("engine_low"))
    },
    menuFadeEngine: function() {
        Inventory.sound && this._howl.fade(this._volume, 0, 500, this.getID(this._current))
    },
    menuReturnEngine: function() {
        Inventory.sound && this._howl.fade(0, this._volume, 500, this.getID(this._current))
    },
    engineCurrent: function(t, i) {
        if (this._current !== t) {
            if (!Inventory.sound) return this._current = t, void(this._volume = i || this._volume);
            this._howl.fade(this._volume, 0, 500, this.getID(this._current)), this._current = t, this._volume = i || this._volume, this._howl.fade(0, this._volume, 500, this.getID(this._current))
        }
    },
    switchVolume: function(t, i) {
        if (void 0 === this._howl) return console.warn("too early to switch volume");
        Inventory.sound ? (console.log(`volume ${this._volume}->${t}`), this._howl.fade(this._volume, t, i || 500, this.getID(this._current)), this._volume = t) : this._volume = t
    },
    pitch: function(t) {
        Inventory.sound && this._howl.rate(t, this.getID(this._current))
    }
};
var TablePurchases = {
    grid: null,
    semantic: null,
    keys: null,
    items: {},
    get: function(r, o) {
        return void 0 === o ? this.keys[r][this.current] : this.keys[r][this.current].replace("%value%", o)
    },
    load: function() {
        var r = this;
        return new Promise((function(o, e) {
            if (null !== r.grid) return o();
            if (r.keys = {}, Helper.params.latestTables) Utils.loadFromSheetProxy("820237204").then((function(e) {
                r.grid = e[0], r.semantic = e[1];
                for (var _ = 0; _ < r.grid.length; _++) {
                    var n = r.grid[_],
                        c = n[r.semantic.indexOf("item")];
                    if (c.indexOf("color") > -1) {
                        var l = c.split("_color")[0];
                        r.items[l].palette.push({
                            item: c,
                            coinToUnlock: Number.parseInt(n[r.semantic.indexOf("coinToUnlock")])
                        })
                    } else r.items[c] = {
                        item: c,
                        fragToUnlock: Number.parseInt(n[r.semantic.indexOf("fragToUnlock")]),
                        oksToUnlock: Number.parseInt(n[r.semantic.indexOf("oksToUnlock")]),
                        voicesToUnlock: Number.parseInt(n[r.semantic.indexOf("voicesToUnlock")]),
                        palette: []
                    }
                }
                o()
            })).catch(e);
            else {
                var _ = Utils.parseStaticProg({
                    status: "ok",
                    result: "item,,coinToUnlock,fragToUnlock,oksToUnlock,voicesToUnlock\r\nhover_catfish,,,0,0,0\r\nhover_catfish_color_1,,0,,,\r\nhover_catfish_color_2,,200,,,\r\nhover_catfish_color_3,,200,,,\r\nhover_catfish_color_4,,200,,,\r\nhover_catfish_color_5,,200,,,\r\nhover_catfish_color_6,,200,,,\r\nhover_catfish_color_7,,200,,,\r\nhover_catfish_color_8,,500,,,\r\n,,,,,\r\nhover_destroyer,,,50,50,5\r\nhover_destroyer_color_1,,500,,,\r\nhover_destroyer_color_2,,0,,,\r\nhover_destroyer_color_3,,750,,,\r\nhover_destroyer_color_4,,500,,,\r\nhover_destroyer_color_5,,500,,,\r\nhover_destroyer_color_6,,500,,,\r\nhover_destroyer_color_7,,500,,,\r\nhover_destroyer_color_8,,1000,,,\r\n,,,,,\r\nhover_explorer,,,50,50,10\r\nhover_explorer_color_1,,750,,,\r\nhover_explorer_color_2,,500,,,\r\nhover_explorer_color_3,,500,,,\r\nhover_explorer_color_4,,500,,,\r\nhover_explorer_color_5,,0,,,\r\nhover_explorer_color_6,,500,,,\r\nhover_explorer_color_7,,500,,,\r\nhover_explorer_color_8,,1000,,,\r\n,,,,,\r\nhover_racer,,,200,100,20\r\nhover_racer_color_1,,2000,,,\r\nhover_racer_color_2,,2000,,,\r\nhover_racer_color_3,,3000,,,\r\nhover_racer_color_4,,0,,,\r\nhover_racer_color_5,,2000,,,\r\nhover_racer_color_6,,2000,,,\r\nhover_racer_color_7,,2000,,,\r\nhover_racer_color_8,,4000,,,\r\n,,,,,\r\nhover_spy,,,300,100,20\r\nhover_spy_color_1,,2000,,,\r\nhover_spy_color_2,,2000,,,\r\nhover_spy_color_3,,3000,,,\r\nhover_spy_color_4,,2000,,,\r\nhover_spy_color_5,,2000,,,\r\nhover_spy_color_6,,2000,,,\r\nhover_spy_color_7,,0,,,\r\nhover_spy_color_8,,4000,,,\r\n,,,,,\r\nhover_spider,,,400,200,40\r\nhover_spider_color_1,,4000,,,\r\nhover_spider_color_2,,4000,,,\r\nhover_spider_color_3,,0,,,\r\nhover_spider_color_4,,4000,,,\r\nhover_spider_color_5,,4000,,,\r\nhover_spider_color_6,,4000,,,\r\nhover_spider_color_7,,4000,,,\r\nhover_spider_color_8,,8000,,,\r\n,,,,,\r\nhover_tank,,,500,200,40\r\nhover_tank_color_1,,4000,,,\r\nhover_tank_color_2,,4000,,,\r\nhover_tank_color_3,,6000,,,\r\nhover_tank_color_4,,4000,,,\r\nhover_tank_color_5,,4000,,,\r\nhover_tank_color_6,,0,,,\r\nhover_tank_color_7,,4000,,,\r\nhover_tank_color_8,,8000,,,"
                });
                r.grid = _[0], r.semantic = _[1];
                for (var n = 0; n < r.grid.length; n++) {
                    var c = r.grid[n],
                        l = c[r.semantic.indexOf("item")];
                    if (l.indexOf("color") > -1) {
                        var s = l.split("_color")[0];
                        r.items[s].palette.push({
                            item: l,
                            coinToUnlock: Number.parseInt(c[r.semantic.indexOf("coinToUnlock")])
                        })
                    } else r.items[l] = {
                        item: l,
                        fragToUnlock: Number.parseInt(c[r.semantic.indexOf("fragToUnlock")]),
                        oksToUnlock: Number.parseInt(c[r.semantic.indexOf("oksToUnlock")]),
                        voicesToUnlock: Number.parseInt(c[r.semantic.indexOf("voicesToUnlock")]),
                        palette: []
                    }
                }
                o()
            }
        }))
    }
};
var PlatformEnum = {
        DEBUG: "debug",
        SOCIAL_OK: "social_ok",
        SOCIAL_VK: "social_vk",
        AZERION: "azerion",
        ANDROID: "android"
    },
    Currency = {
        COIN: "coin",
        FRAG: "frag",
        REWARDABLE: "rw",
        OK: "ok",
        VOICE: "voice"
    },
    TAGS = {
        [PlatformEnum.DEBUG]: "G-6GS532CMMV",
        [PlatformEnum.ANDROID]: "G-6GS532CMMV",
        [PlatformEnum.AZERION]: "G-J67Q5WNGY8"
    },
    Platform = {
        current: PlatformEnum.AZERION,
        gtag: null,
        _lastInter: 0,
        init: function() {
            return new Promise((function(e) {
                Platform.current === PlatformEnum.DEBUG && (console.log("loading gtag+debug"), Promise.all([Platform._loadGtag()]).then(e)), Platform.current === PlatformEnum.AZERION && (console.log("loading gtag+azerion"), Promise.all([Platform._loadGtag(), Platform._loadGD()]).then(e)), Platform.current === PlatformEnum.ANDROID && (console.log("loading gtag+cordova"), Promise.all([Platform._loadGtag(), Platform._loadCordova()]).then(e))
            }))
        },
        event: function(e, o) {
            null !== Platform.gtag && Platform.gtag("event", e, o)
        },
        userProperty: function(e) {
            null !== Platform.gtag && Platform.gtag("set", "user_properties", e)
        },
        preloadAds() {
            // Platform.current === PlatformEnum.AZERION && (void 0 === window.gdsdk || void 0 === window.gdsdk.preloadAd ? console.warn("cannot preload: no gdsdk") : (window.gdsdk.preloadAd(window.gdsdk.AdType.Preroll), window.gdsdk.preloadAd(window.gdsdk.AdType.Midroll), window.gdsdk.preloadAd(window.gdsdk.AdType.Rewarded)))
        },
        showPreRoll: () => new Promise((function(e, o) {
            if (Platform.current === PlatformEnum.AZERION) {
                o();

                GAMESDK.showAd({
                    beforeShowAd: () => {
                        SFX.menuFadeEngine()
                       
                    },
                    afterShowAd: () => {
                        SFX.menuReturnEngine();
                        Platform.event("pre_roll_success", {
                            event_category: "ecommerce"
                        }), e()
    
                    }
                });
            } else Platform.current === PlatformEnum.ANDROID ? e() : (console.warn("not implemented preroll"), Utils.waitForSeconds(.5).then(e))
        })),
        showInterstitial: e => new Promise((function(o, n) {
            if (Platform.current === PlatformEnum.AZERION) {
                

                GAMESDK.showAd({
                    beforeShowAd: () => {
                        SFX.menuFadeEngine()
                        n();
                    },
                    afterShowAd: () => {
                        SFX.menuReturnEngine();
                        Platform.event("mid_roll_success", {
                            event_label: e,
                            event_category: "ecommerce"
                        }), o()
    
                    }
                });

            } else if (Platform.current === PlatformEnum.ANDROID) {
                var t = Date.now();
                console.log("will show Enhance inter. timing:", t - Platform._lastInter), t - Platform._lastInter > 6e4 ? Enhance.isInterstitialReady((function(t) {
                    t ? (console.log("enhance inter success"), Platform.event("mid_roll_success", {
                        event_label: e,
                        event_category: "ecommerce"
                    }), Platform._lastInter = Date.now(), Enhance.showInterstitialAd(), o()) : (console.log("enhance inter failed"), n())
                })) : n()
            } else console.warn("not implemented interstitial"), Utils.waitForSeconds(.5).then(o)
        })),
        showRV: e => new Promise((function(o, n) {
            if (Platform.current === PlatformEnum.AZERION) {
                
                GAMESDK.showAdOfEvent({
                    onRewardBeforeBreak: () => {
                        SFX.menuFadeEngine()
                        n();
                    },
                    onRewardAfterBreak: () => {
                        SFX.menuFadeEngine()

                        
                    },
                    onRewardComplete: () => {
    
                        Platform.event("rewarded_success", {
                            event_label: e,
                            event_category: "ecommerce"
                        }), o()
                    },
                    onRewardDismissed: () => {
    
                    }
                });


            } else Platform.current === PlatformEnum.ANDROID ? (console.log("will show Enhance RV"), Enhance.isRewardedAdReady((function(t) {
                t ? (console.log("Enhance RV"), Enhance.showRewardedAd((function() {
                    Platform.event("rewarded_success", {
                        event_label: e,
                        event_category: "ecommerce"
                    }), o()
                }), n, n)) : (console.log("Enhance RV failed"), n())
            }))) : (console.warn("not implemented RV"), Utils.waitForSeconds(.5).then(o))
        })),
        __insertScript: function(e, o) {
            const n = document.getElementsByTagName("head")[0],
                t = document.createElement("script");
            t.async = !0, t.type = "text/javascript", t.onload = o, t.src = e, n.appendChild(t)
        },
        _loadGtag: function() {
            return new Promise((function(e) {
                Platform.__insertScript("patch/js/null.js?www.googletagmanager.com/gtag/js?id=" + TAGS[Platform.current], (function() {
                    window.dataLayer = window.dataLayer || [], Platform.gtag = function() {
                        dataLayer.push(arguments)
                    }, Platform.gtag("js", new Date), Platform.gtag("config", TAGS[Platform.current]), console.log("gtag loaded"), e()
                }))
            }))
        },
        _loadGD: function() {
            return new Promise((function(e) {
                e();
            }))
        },
        _loadCordova: function() {
            return new Promise((function(e) {
                document.addEventListener("deviceready", (function() {
                    console.log("Running cordova-" + cordova.platformId + "@" + cordova.version), document.addEventListener("pause", SFX.menuFadeEngine, !1), document.addEventListener("resume", SFX.menuReturnEngine, !1), e()
                }), !1), Platform.__insertScript("cordova.js", (function() {
                    window.dataLayer = window.dataLayer || [], Platform.gtag = function() {
                        dataLayer.push(arguments)
                    }, Platform.gtag("js", new Date), Platform.gtag("config", TAGS[Platform.current]), console.log("gtag loaded")
                }))
            }))
        }
    };
var ColorInjector = pc.createScript("colorInjector");
ColorInjector.attributes.add("buttons", {
    type: "entity",
    array: !0
}), ColorInjector.attributes.add("backgroundElements", {
    type: "entity",
    array: !0
}), ColorInjector.attributes.add("foregroundElements", {
    type: "entity",
    array: !0
}), ColorInjector.attributes.add("background", {
    type: "rgb"
}), ColorInjector.attributes.add("content", {
    type: "rgb"
}), ColorInjector.attributes.add("hoverTint", {
    type: "rgba"
}), ColorInjector.attributes.add("pressedTint", {
    type: "rgba"
}), ColorInjector.attributes.add("inactiveTint", {
    type: "rgba"
}), ColorInjector.prototype.postInitialize = function() {
    var t;
    for (t = 0; t < this.buttons.length; t++) this.buttons[t].element.color = this.background, this.buttons[t].button.hoverTint = this.hoverTint, this.buttons[t].button.pressedTint = this.pressedTint, this.buttons[t].button.inactiveTint = this.inactiveTint;
    for (t = 0; t < this.backgroundElements.length; t++) this.backgroundElements[t].element.color = this.background;
    for (t = 0; t < this.foregroundElements.length; t++) this.foregroundElements[t].element.color = this.content, this.foregroundElements[t].element.outlineColor = this.content
}, ColorInjector.prototype.update = function(t) {};
var ButtonScaleBehaviour = pc.createScript("buttonScaleBehaviour");
ButtonScaleBehaviour.prototype.initialize = function() {
    this.entity.element.on("click", this.onClick, this), this.tween = null
}, ButtonScaleBehaviour.prototype.onClick = function() {
    this.tween && this.tween.kill(), SFX.playVariance("ui_click"), this.entity.button.active && Utils.scaleBounce(this.entity, .9, 1, .6)
};
var PowerupRandom = pc.createScript("powerupRandom");
PowerupRandom.attributes.add("cooldown", {
    type: "number"
}), PowerupRandom.prototype.postInitialize = function() {
    this._time = 0, this._roster = ["powerupEnlarger", "powerupNitro", "powerupShooter", "powerupSmoke", "powerupSphere"], this._enabled = Helper.game.rules.ruleset === GameRules.RANDOM_POWERUP
}, PowerupRandom.prototype.update = function(e) {
    if (!(this.entity.script.player._state == PlayerState.DESTROYING || this.entity.script.player._state == PlayerState.DESTROYED || Helper.game.state !== GameState.PLAYING || this.entity.script.player._state.indexOf("waitingRespawn") > -1) && this._enabled && (e *= Helper.game.timeScale, this._time += e, this._time >= this.cooldown)) {
        this._time = 0;
        var t = Math.floor(pc.math.random(0, this._roster.length));
        this.entity.script[this._roster[t]].launch()
    }
};
var PopupUnlock = pc.createScript("popupUnlock");
PopupUnlock.attributes.add("header", {
    type: "entity"
}), PopupUnlock.attributes.add("imageSlot", {
    type: "entity"
}), PopupUnlock.attributes.add("okButton", {
    type: "entity"
}), PopupUnlock.prototype.initialize = function() {
    this.okButton.element.on("click", function() {
        this.okButton.button.active = !1, 
        GAMESDK.showAd({
            beforeShowAd: () => {
                SFX.menuFadeEngine()
               
            },
            afterShowAd: () => {
                Helper.screenLevelIndicator.tween.kill(), setTimeout(Helper.game.reloadGame.bind(Helper.game), 50)
                SFX.menuReturnEngine();
            }
        })
    }.bind(this))
}, PopupUnlock.prototype.show = function() {
    var e = Helper.tableUnlocking.nextUnlock;
    this.header.element.text = Locale.get("unlock_" + Helper.tableUnlocking.itemIds[e]);
    var t = Helper.tableUnlocking.previewTextures[e].resource;
    this.imageSlot.element.texture = t, this.entity.script.tween.play()
};
var PopupLastChance = pc.createScript("popupLastChance");
PopupLastChance.attributes.add("header", {
    type: "entity"
}), PopupLastChance.attributes.add("buttonWatch", {
    type: "entity"
}), PopupLastChance.attributes.add("buttonDecline", {
    type: "entity"
}), PopupLastChance.prototype.initialize = function() {
    this.header.element.text = Locale.get("popup_last_chance_header"), this.usedLastChance = !1
}, PopupLastChance.prototype.show = function(t, e, i) {
    this.usedLastChance ? i() : (Helper.compositions.showFade(), this.entity.script.tween.play(), Utils.valueBounce(Helper.game, "timeScale", Helper.game.timeScale, .01, .4), Utils.valueBounce(Helper.game, "sessionTimerScale", 1, .01, .4), "life" === t && (this.buttonWatch.children[1].element.text = Locale.get("popup_last_chance_life")), "time" === t && (this.buttonWatch.children[1].element.text = Locale.get("popup_last_chance_time")), this.buttonWatch.element.once("click", function() {
        this.buttonWatch.button.active = !1, this.buttonDecline.button.active = !1,			GAMESDK.showAdOfEvent({
            onRewardBeforeBreak: () => {
                this.buttonWatch.button.active = !0, this.buttonDecline.button.active = !0
                SFX.menuFadeEngine()
            },
            onRewardAfterBreak: () => {
                
                SFX.menuReturnEngine();
            },
            onRewardComplete: () => {
                Utils.valueBounce(Helper.game, "timeScale", .01, 1, .4), Utils.valueBounce(Helper.game, "sessionTimerScale", .01, 1, .4), this.entity.script.tween.playReverse(), this.usedLastChance = !0, Helper.compositions.hideFade(), e()
              
            },
            onRewardDismissed: () => {

            }
        })
    }.bind(this)), this.buttonDecline.element.once("click", function() {
        this.buttonWatch.button.active = !1, this.buttonDecline.button.active = !1, this.entity.script.tween.playReverse(), i()
    }.bind(this)))
}; // howler.min.js
/*! howler.js v2.2.1 | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
! function() {
    "use strict";
    var e = function() {
        this.init()
    };
    e.prototype = {
        init: function() {
            var e = this || n;
            return e._counter = 1e3, e._html5AudioPool = [], e.html5PoolSize = 10, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.autoUnlock = !0, e._setup(), e
        },
        volume: function(e) {
            var o = this || n;
            if (e = parseFloat(e), o.ctx || _(), void 0 !== e && e >= 0 && e <= 1) {
                if (o._volume = e, o._muted) return o;
                o.usingWebAudio && o.masterGain.gain.setValueAtTime(e, n.ctx.currentTime);
                for (var t = 0; t < o._howls.length; t++)
                    if (!o._howls[t]._webAudio)
                        for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
                            var u = o._howls[t]._soundById(r[a]);
                            u && u._node && (u._node.volume = u._volume * e)
                        }
                return o
            }
            return o._volume
        },
        mute: function(e) {
            var o = this || n;
            o.ctx || _(), o._muted = e, o.usingWebAudio && o.masterGain.gain.setValueAtTime(e ? 0 : o._volume, n.ctx.currentTime);
            for (var t = 0; t < o._howls.length; t++)
                if (!o._howls[t]._webAudio)
                    for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
                        var u = o._howls[t]._soundById(r[a]);
                        u && u._node && (u._node.muted = !!e || u._muted)
                    }
            return o
        },
        stop: function() {
            for (var e = this || n, o = 0; o < e._howls.length; o++) e._howls[o].stop();
            return e
        },
        unload: function() {
            for (var e = this || n, o = e._howls.length - 1; o >= 0; o--) e._howls[o].unload();
            return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(), e.ctx = null, _()), e
        },
        codecs: function(e) {
            return (this || n)._codecs[e.replace(/^x-/, "")]
        },
        _setup: function() {
            var e = this || n;
            if (e.state = e.ctx ? e.ctx.state || "suspended" : "suspended", e._autoSuspend(), !e.usingWebAudio)
                if ("undefined" != typeof Audio) try {
                    var o = new Audio;
                    void 0 === o.oncanplaythrough && (e._canPlayEvent = "canplay")
                } catch (n) {
                    e.noAudio = !0
                } else e.noAudio = !0;
            try {
                var o = new Audio;
                o.muted && (e.noAudio = !0)
            } catch (e) {}
            return e.noAudio || e._setupCodecs(), e
        },
        _setupCodecs: function() {
            var e = this || n,
                o = null;
            try {
                o = "undefined" != typeof Audio ? new Audio : null
            } catch (n) {
                return e
            }
            if (!o || "function" != typeof o.canPlayType) return e;
            var t = o.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
                a = r && parseInt(r[0].split("/")[1], 10) < 33;
            return e._codecs = {
                mp3: !(a || !t && !o.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!t,
                opus: !!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                oga: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!(o.canPlayType('audio/wav; codecs="1"') || o.canPlayType("audio/wav")).replace(/^no$/, ""),
                aac: !!o.canPlayType("audio/aac;").replace(/^no$/, ""),
                caf: !!o.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                m4a: !!(o.canPlayType("audio/x-m4a;") || o.canPlayType("audio/m4a;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                m4b: !!(o.canPlayType("audio/x-m4b;") || o.canPlayType("audio/m4b;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(o.canPlayType("audio/x-mp4;") || o.canPlayType("audio/mp4;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                dolby: !!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                flac: !!(o.canPlayType("audio/x-flac;") || o.canPlayType("audio/flac;")).replace(/^no$/, "")
            }, e
        },
        _unlockAudio: function() {
            var e = this || n;
            if (!e._audioUnlocked && e.ctx) {
                e._audioUnlocked = !1, e.autoUnlock = !1, e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
                var o = function(n) {
                    for (; e._html5AudioPool.length < e.html5PoolSize;) try {
                        var t = new Audio;
                        t._unlocked = !0, e._releaseHtml5Audio(t)
                    } catch (n) {
                        e.noAudio = !0;
                        break
                    }
                    for (var r = 0; r < e._howls.length; r++)
                        if (!e._howls[r]._webAudio)
                            for (var a = e._howls[r]._getSoundIds(), u = 0; u < a.length; u++) {
                                var d = e._howls[r]._soundById(a[u]);
                                d && d._node && !d._node._unlocked && (d._node._unlocked = !0, d._node.load())
                            }
                    e._autoResume();
                    var i = e.ctx.createBufferSource();
                    i.buffer = e._scratchBuffer, i.connect(e.ctx.destination), void 0 === i.start ? i.noteOn(0) : i.start(0), "function" == typeof e.ctx.resume && e.ctx.resume(), i.onended = function() {
                        i.disconnect(0), e._audioUnlocked = !0, document.removeEventListener("touchstart", o, !0), document.removeEventListener("touchend", o, !0), document.removeEventListener("click", o, !0);
                        for (var n = 0; n < e._howls.length; n++) e._howls[n]._emit("unlock")
                    }
                };
                return document.addEventListener("touchstart", o, !0), document.addEventListener("touchend", o, !0), document.addEventListener("click", o, !0), e
            }
        },
        _obtainHtml5Audio: function() {
            var e = this || n;
            if (e._html5AudioPool.length) return e._html5AudioPool.pop();
            var o = (new Audio).play();
            return o && "undefined" != typeof Promise && (o instanceof Promise || "function" == typeof o.then) && o.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")
            }), new Audio
        },
        _releaseHtml5Audio: function(e) {
            var o = this || n;
            return e._unlocked && o._html5AudioPool.push(e), o
        },
        _autoSuspend: function() {
            var e = this;
            if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && n.usingWebAudio) {
                for (var o = 0; o < e._howls.length; o++)
                    if (e._howls[o]._webAudio)
                        for (var t = 0; t < e._howls[o]._sounds.length; t++)
                            if (!e._howls[o]._sounds[t]._paused) return e;
                return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function() {
                    if (e.autoSuspend) {
                        e._suspendTimer = null, e.state = "suspending";
                        var n = function() {
                            e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume())
                        };
                        e.ctx.suspend().then(n, n)
                    }
                }, 3e4), e
            }
        },
        _autoResume: function() {
            var e = this;
            if (e.ctx && void 0 !== e.ctx.resume && n.usingWebAudio) return "running" === e.state && "interrupted" !== e.ctx.state && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : "suspended" === e.state || "running" === e.state && "interrupted" === e.ctx.state ? (e.ctx.resume().then(function() {
                e.state = "running";
                for (var n = 0; n < e._howls.length; n++) e._howls[n]._emit("resume")
            }), e._suspendTimer && (clearTimeout(e._suspendTimer), e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0), e
        }
    };
    var n = new e,
        o = function(e) {
            var n = this;
            if (!e.src || 0 === e.src.length) return void console.error("An array of source files must be passed with any new Howl.");
            n.init(e)
        };
    o.prototype = {
        init: function(e) {
            var o = this;
            return n.ctx || _(), o._autoplay = e.autoplay || !1, o._format = "string" != typeof e.format ? e.format : [e.format], o._html5 = e.html5 || !1, o._muted = e.mute || !1, o._loop = e.loop || !1, o._pool = e.pool || 5, o._preload = "boolean" != typeof e.preload && "metadata" !== e.preload || e.preload, o._rate = e.rate || 1, o._sprite = e.sprite || {}, o._src = "string" != typeof e.src ? e.src : [e.src], o._volume = void 0 !== e.volume ? e.volume : 1, o._xhr = {
                method: e.xhr && e.xhr.method ? e.xhr.method : "GET",
                headers: e.xhr && e.xhr.headers ? e.xhr.headers : null,
                withCredentials: !(!e.xhr || !e.xhr.withCredentials) && e.xhr.withCredentials
            }, o._duration = 0, o._state = "unloaded", o._sounds = [], o._endTimers = {}, o._queue = [], o._playLock = !1, o._onend = e.onend ? [{
                fn: e.onend
            }] : [], o._onfade = e.onfade ? [{
                fn: e.onfade
            }] : [], o._onload = e.onload ? [{
                fn: e.onload
            }] : [], o._onloaderror = e.onloaderror ? [{
                fn: e.onloaderror
            }] : [], o._onplayerror = e.onplayerror ? [{
                fn: e.onplayerror
            }] : [], o._onpause = e.onpause ? [{
                fn: e.onpause
            }] : [], o._onplay = e.onplay ? [{
                fn: e.onplay
            }] : [], o._onstop = e.onstop ? [{
                fn: e.onstop
            }] : [], o._onmute = e.onmute ? [{
                fn: e.onmute
            }] : [], o._onvolume = e.onvolume ? [{
                fn: e.onvolume
            }] : [], o._onrate = e.onrate ? [{
                fn: e.onrate
            }] : [], o._onseek = e.onseek ? [{
                fn: e.onseek
            }] : [], o._onunlock = e.onunlock ? [{
                fn: e.onunlock
            }] : [], o._onresume = [], o._webAudio = n.usingWebAudio && !o._html5, void 0 !== n.ctx && n.ctx && n.autoUnlock && n._unlockAudio(), n._howls.push(o), o._autoplay && o._queue.push({
                event: "play",
                action: function() {
                    o.play()
                }
            }), o._preload && "none" !== o._preload && o.load(), o
        },
        load: function() {
            var e = this,
                o = null;
            if (n.noAudio) return void e._emit("loaderror", null, "No audio support.");
            "string" == typeof e._src && (e._src = [e._src]);
            for (var r = 0; r < e._src.length; r++) {
                var u, d;
                if (e._format && e._format[r]) u = e._format[r];
                else {
                    if ("string" != typeof(d = e._src[r])) {
                        e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                        continue
                    }
                    u = /^data:audio\/([^;,]+);/i.exec(d), u || (u = /\.([^.]+)$/.exec(d.split("?", 1)[0])), u && (u = u[1].toLowerCase())
                }
                if (u || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), u && n.codecs(u)) {
                    o = e._src[r];
                    break
                }
            }
            return o ? (e._src = o, e._state = "loading", "https:" === window.location.protocol && "http:" === o.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new t(e), e._webAudio && a(e), e) : void e._emit("loaderror", null, "No codec support for selected audio sources.")
        },
        play: function(e, o) {
            var t = this,
                r = null;
            if ("number" == typeof e) r = e, e = null;
            else {
                if ("string" == typeof e && "loaded" === t._state && !t._sprite[e]) return null;
                if (void 0 === e && (e = "__default", !t._playLock)) {
                    for (var a = 0, u = 0; u < t._sounds.length; u++) t._sounds[u]._paused && !t._sounds[u]._ended && (a++, r = t._sounds[u]._id);
                    1 === a ? e = null : r = null
                }
            }
            var d = r ? t._soundById(r) : t._inactiveSound();
            if (!d) return null;
            if (r && !e && (e = d._sprite || "__default"), "loaded" !== t._state) {
                d._sprite = e, d._ended = !1;
                var i = d._id;
                return t._queue.push({
                    event: "play",
                    action: function() {
                        t.play(i)
                    }
                }), i
            }
            if (r && !d._paused) return o || t._loadQueue("play"), d._id;
            t._webAudio && n._autoResume();
            var _ = Math.max(0, d._seek > 0 ? d._seek : t._sprite[e][0] / 1e3),
                s = Math.max(0, (t._sprite[e][0] + t._sprite[e][1]) / 1e3 - _),
                l = 1e3 * s / Math.abs(d._rate),
                c = t._sprite[e][0] / 1e3,
                f = (t._sprite[e][0] + t._sprite[e][1]) / 1e3;
            d._sprite = e, d._ended = !1;
            var p = function() {
                d._paused = !1, d._seek = _, d._start = c, d._stop = f, d._loop = !(!d._loop && !t._sprite[e][2])
            };
            if (_ >= f) return void t._ended(d);
            var m = d._node;
            if (t._webAudio) {
                var v = function() {
                    t._playLock = !1, p(), t._refreshBuffer(d);
                    var e = d._muted || t._muted ? 0 : d._volume;
                    m.gain.setValueAtTime(e, n.ctx.currentTime), d._playStart = n.ctx.currentTime, void 0 === m.bufferSource.start ? d._loop ? m.bufferSource.noteGrainOn(0, _, 86400) : m.bufferSource.noteGrainOn(0, _, s) : d._loop ? m.bufferSource.start(0, _, 86400) : m.bufferSource.start(0, _, s), l !== 1 / 0 && (t._endTimers[d._id] = setTimeout(t._ended.bind(t, d), l)), o || setTimeout(function() {
                        t._emit("play", d._id), t._loadQueue()
                    }, 0)
                };
                "running" === n.state && "interrupted" !== n.ctx.state ? v() : (t._playLock = !0, t.once("resume", v), t._clearTimer(d._id))
            } else {
                var h = function() {
                    m.currentTime = _, m.muted = d._muted || t._muted || n._muted || m.muted, m.volume = d._volume * n.volume(), m.playbackRate = d._rate;
                    try {
                        var r = m.play();
                        if (r && "undefined" != typeof Promise && (r instanceof Promise || "function" == typeof r.then) ? (t._playLock = !0, p(), r.then(function() {
                                t._playLock = !1, m._unlocked = !0, o || (t._emit("play", d._id), t._loadQueue())
                            }).catch(function() {
                                t._playLock = !1, t._emit("playerror", d._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."), d._ended = !0, d._paused = !0
                            })) : o || (t._playLock = !1, p(), t._emit("play", d._id), t._loadQueue()), m.playbackRate = d._rate, m.paused) return void t._emit("playerror", d._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                        "__default" !== e || d._loop ? t._endTimers[d._id] = setTimeout(t._ended.bind(t, d), l) : (t._endTimers[d._id] = function() {
                            t._ended(d), m.removeEventListener("ended", t._endTimers[d._id], !1)
                        }, m.addEventListener("ended", t._endTimers[d._id], !1))
                    } catch (e) {
                        t._emit("playerror", d._id, e)
                    }
                };
                "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" === m.src && (m.src = t._src, m.load());
                var y = window && window.ejecta || !m.readyState && n._navigator.isCocoonJS;
                if (m.readyState >= 3 || y) h();
                else {
                    t._playLock = !0;
                    var g = function() {
                        h(), m.removeEventListener(n._canPlayEvent, g, !1)
                    };
                    m.addEventListener(n._canPlayEvent, g, !1), t._clearTimer(d._id)
                }
            }
            return d._id
        },
        pause: function(e) {
            var n = this;
            if ("loaded" !== n._state || n._playLock) return n._queue.push({
                event: "pause",
                action: function() {
                    n.pause(e)
                }
            }), n;
            for (var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
                n._clearTimer(o[t]);
                var r = n._soundById(o[t]);
                if (r && !r._paused && (r._seek = n.seek(o[t]), r._rateSeek = 0, r._paused = !0, n._stopFade(o[t]), r._node))
                    if (n._webAudio) {
                        if (!r._node.bufferSource) continue;
                        void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), n._cleanBuffer(r._node)
                    } else isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();
                arguments[1] || n._emit("pause", r ? r._id : null)
            }
            return n
        },
        stop: function(e, n) {
            var o = this;
            if ("loaded" !== o._state || o._playLock) return o._queue.push({
                event: "stop",
                action: function() {
                    o.stop(e)
                }
            }), o;
            for (var t = o._getSoundIds(e), r = 0; r < t.length; r++) {
                o._clearTimer(t[r]);
                var a = o._soundById(t[r]);
                a && (a._seek = a._start || 0, a._rateSeek = 0, a._paused = !0, a._ended = !0, o._stopFade(t[r]), a._node && (o._webAudio ? a._node.bufferSource && (void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0), o._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== 1 / 0 || (a._node.currentTime = a._start || 0, a._node.pause(), a._node.duration === 1 / 0 && o._clearSound(a._node))), n || o._emit("stop", a._id))
            }
            return o
        },
        mute: function(e, o) {
            var t = this;
            if ("loaded" !== t._state || t._playLock) return t._queue.push({
                event: "mute",
                action: function() {
                    t.mute(e, o)
                }
            }), t;
            if (void 0 === o) {
                if ("boolean" != typeof e) return t._muted;
                t._muted = e
            }
            for (var r = t._getSoundIds(o), a = 0; a < r.length; a++) {
                var u = t._soundById(r[a]);
                u && (u._muted = e, u._interval && t._stopFade(u._id), t._webAudio && u._node ? u._node.gain.setValueAtTime(e ? 0 : u._volume, n.ctx.currentTime) : u._node && (u._node.muted = !!n._muted || e), t._emit("mute", u._id))
            }
            return t
        },
        volume: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) return t._volume;
            if (1 === r.length || 2 === r.length && void 0 === r[1]) {
                t._getSoundIds().indexOf(r[0]) >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else r.length >= 2 && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            var a;
            if (!(void 0 !== e && e >= 0 && e <= 1)) return a = o ? t._soundById(o) : t._sounds[0], a ? a._volume : 0;
            if ("loaded" !== t._state || t._playLock) return t._queue.push({
                event: "volume",
                action: function() {
                    t.volume.apply(t, r)
                }
            }), t;
            void 0 === o && (t._volume = e), o = t._getSoundIds(o);
            for (var u = 0; u < o.length; u++)(a = t._soundById(o[u])) && (a._volume = e, r[2] || t._stopFade(o[u]), t._webAudio && a._node && !a._muted ? a._node.gain.setValueAtTime(e, n.ctx.currentTime) : a._node && !a._muted && (a._node.volume = e * n.volume()), t._emit("volume", a._id));
            return t
        },
        fade: function(e, o, t, r) {
            var a = this;
            if ("loaded" !== a._state || a._playLock) return a._queue.push({
                event: "fade",
                action: function() {
                    a.fade(e, o, t, r)
                }
            }), a;
            e = Math.min(Math.max(0, parseFloat(e)), 1), o = Math.min(Math.max(0, parseFloat(o)), 1), t = parseFloat(t), a.volume(e, r);
            for (var u = a._getSoundIds(r), d = 0; d < u.length; d++) {
                var i = a._soundById(u[d]);
                if (i) {
                    if (r || a._stopFade(u[d]), a._webAudio && !i._muted) {
                        var _ = n.ctx.currentTime,
                            s = _ + t / 1e3;
                        i._volume = e, i._node.gain.setValueAtTime(e, _), i._node.gain.linearRampToValueAtTime(o, s)
                    }
                    a._startFadeInterval(i, e, o, t, u[d], void 0 === r)
                }
            }
            return a
        },
        _startFadeInterval: function(e, n, o, t, r, a) {
            var u = this,
                d = n,
                i = o - n,
                _ = Math.abs(i / .01),
                s = Math.max(4, _ > 0 ? t / _ : t),
                l = Date.now();
            e._fadeTo = o, e._interval = setInterval(function() {
                var r = (Date.now() - l) / t;
                l = Date.now(), d += i * r, d = Math.round(100 * d) / 100, d = i < 0 ? Math.max(o, d) : Math.min(o, d), u._webAudio ? e._volume = d : u.volume(d, e._id, !0), a && (u._volume = d), (o < n && d <= o || o > n && d >= o) && (clearInterval(e._interval), e._interval = null, e._fadeTo = null, u.volume(o, e._id), u._emit("fade", e._id))
            }, s)
        },
        _stopFade: function(e) {
            var o = this,
                t = o._soundById(e);
            return t && t._interval && (o._webAudio && t._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(t._interval), t._interval = null, o.volume(t._fadeTo, e), t._fadeTo = null, o._emit("fade", e)), o
        },
        loop: function() {
            var e, n, o, t = this,
                r = arguments;
            if (0 === r.length) return t._loop;
            if (1 === r.length) {
                if ("boolean" != typeof r[0]) return !!(o = t._soundById(parseInt(r[0], 10))) && o._loop;
                e = r[0], t._loop = e
            } else 2 === r.length && (e = r[0], n = parseInt(r[1], 10));
            for (var a = t._getSoundIds(n), u = 0; u < a.length; u++)(o = t._soundById(a[u])) && (o._loop = e, t._webAudio && o._node && o._node.bufferSource && (o._node.bufferSource.loop = e, e && (o._node.bufferSource.loopStart = o._start || 0, o._node.bufferSource.loopEnd = o._stop)));
            return t
        },
        rate: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) o = t._sounds[0]._id;
            else if (1 === r.length) {
                var a = t._getSoundIds(),
                    u = a.indexOf(r[0]);
                u >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            var d;
            if ("number" != typeof e) return d = t._soundById(o), d ? d._rate : t._rate;
            if ("loaded" !== t._state || t._playLock) return t._queue.push({
                event: "rate",
                action: function() {
                    t.rate.apply(t, r)
                }
            }), t;
            void 0 === o && (t._rate = e), o = t._getSoundIds(o);
            for (var i = 0; i < o.length; i++)
                if (d = t._soundById(o[i])) {
                    t.playing(o[i]) && (d._rateSeek = t.seek(o[i]), d._playStart = t._webAudio ? n.ctx.currentTime : d._playStart), d._rate = e, t._webAudio && d._node && d._node.bufferSource ? d._node.bufferSource.playbackRate.setValueAtTime(e, n.ctx.currentTime) : d._node && (d._node.playbackRate = e);
                    var _ = t.seek(o[i]),
                        s = (t._sprite[d._sprite][0] + t._sprite[d._sprite][1]) / 1e3 - _,
                        l = 1e3 * s / Math.abs(d._rate);
                    !t._endTimers[o[i]] && d._paused || (t._clearTimer(o[i]), t._endTimers[o[i]] = setTimeout(t._ended.bind(t, d), l)), t._emit("rate", d._id)
                }
            return t
        },
        seek: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) o = t._sounds[0]._id;
            else if (1 === r.length) {
                var a = t._getSoundIds(),
                    u = a.indexOf(r[0]);
                u >= 0 ? o = parseInt(r[0], 10) : t._sounds.length && (o = t._sounds[0]._id, e = parseFloat(r[0]))
            } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            if (void 0 === o) return t;
            if ("number" == typeof e && ("loaded" !== t._state || t._playLock)) return t._queue.push({
                event: "seek",
                action: function() {
                    t.seek.apply(t, r)
                }
            }), t;
            var d = t._soundById(o);
            if (d) {
                if (!("number" == typeof e && e >= 0)) {
                    if (t._webAudio) {
                        var i = t.playing(o) ? n.ctx.currentTime - d._playStart : 0,
                            _ = d._rateSeek ? d._rateSeek - d._seek : 0;
                        return d._seek + (_ + i * Math.abs(d._rate))
                    }
                    return d._node.currentTime
                }
                var s = t.playing(o);
                s && t.pause(o, !0), d._seek = e, d._ended = !1, t._clearTimer(o), t._webAudio || !d._node || isNaN(d._node.duration) || (d._node.currentTime = e);
                var l = function() {
                    t._emit("seek", o), s && t.play(o, !0)
                };
                if (s && !t._webAudio) {
                    var c = function() {
                        t._playLock ? setTimeout(c, 0) : l()
                    };
                    setTimeout(c, 0)
                } else l()
            }
            return t
        },
        playing: function(e) {
            var n = this;
            if ("number" == typeof e) {
                var o = n._soundById(e);
                return !!o && !o._paused
            }
            for (var t = 0; t < n._sounds.length; t++)
                if (!n._sounds[t]._paused) return !0;
            return !1
        },
        duration: function(e) {
            var n = this,
                o = n._duration,
                t = n._soundById(e);
            return t && (o = n._sprite[t._sprite][1] / 1e3), o
        },
        state: function() {
            return this._state
        },
        unload: function() {
            for (var e = this, o = e._sounds, t = 0; t < o.length; t++) o[t]._paused || e.stop(o[t]._id), e._webAudio || (e._clearSound(o[t]._node), o[t]._node.removeEventListener("error", o[t]._errorFn, !1), o[t]._node.removeEventListener(n._canPlayEvent, o[t]._loadFn, !1), o[t]._node.removeEventListener("ended", o[t]._endFn, !1), n._releaseHtml5Audio(o[t]._node)), delete o[t]._node, e._clearTimer(o[t]._id);
            var a = n._howls.indexOf(e);
            a >= 0 && n._howls.splice(a, 1);
            var u = !0;
            for (t = 0; t < n._howls.length; t++)
                if (n._howls[t]._src === e._src || e._src.indexOf(n._howls[t]._src) >= 0) {
                    u = !1;
                    break
                }
            return r && u && delete r[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null
        },
        on: function(e, n, o, t) {
            var r = this,
                a = r["_on" + e];
            return "function" == typeof n && a.push(t ? {
                id: o,
                fn: n,
                once: t
            } : {
                id: o,
                fn: n
            }), r
        },
        off: function(e, n, o) {
            var t = this,
                r = t["_on" + e],
                a = 0;
            if ("number" == typeof n && (o = n, n = null), n || o)
                for (a = 0; a < r.length; a++) {
                    var u = o === r[a].id;
                    if (n === r[a].fn && u || !n && u) {
                        r.splice(a, 1);
                        break
                    }
                } else if (e) t["_on" + e] = [];
                else {
                    var d = Object.keys(t);
                    for (a = 0; a < d.length; a++) 0 === d[a].indexOf("_on") && Array.isArray(t[d[a]]) && (t[d[a]] = [])
                }
            return t
        },
        once: function(e, n, o) {
            var t = this;
            return t.on(e, n, o, 1), t
        },
        _emit: function(e, n, o) {
            for (var t = this, r = t["_on" + e], a = r.length - 1; a >= 0; a--) r[a].id && r[a].id !== n && "load" !== e || (setTimeout(function(e) {
                e.call(this, n, o)
            }.bind(t, r[a].fn), 0), r[a].once && t.off(e, r[a].fn, r[a].id));
            return t._loadQueue(e), t
        },
        _loadQueue: function(e) {
            var n = this;
            if (n._queue.length > 0) {
                var o = n._queue[0];
                o.event === e && (n._queue.shift(), n._loadQueue()), e || o.action()
            }
            return n
        },
        _ended: function(e) {
            var o = this,
                t = e._sprite;
            if (!o._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop) return setTimeout(o._ended.bind(o, e), 100), o;
            var r = !(!e._loop && !o._sprite[t][2]);
            if (o._emit("end", e._id), !o._webAudio && r && o.stop(e._id, !0).play(e._id), o._webAudio && r) {
                o._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime;
                var a = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                o._endTimers[e._id] = setTimeout(o._ended.bind(o, e), a)
            }
            return o._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, o._clearTimer(e._id), o._cleanBuffer(e._node), n._autoSuspend()), o._webAudio || r || o.stop(e._id, !0), o
        },
        _clearTimer: function(e) {
            var n = this;
            if (n._endTimers[e]) {
                if ("function" != typeof n._endTimers[e]) clearTimeout(n._endTimers[e]);
                else {
                    var o = n._soundById(e);
                    o && o._node && o._node.removeEventListener("ended", n._endTimers[e], !1)
                }
                delete n._endTimers[e]
            }
            return n
        },
        _soundById: function(e) {
            for (var n = this, o = 0; o < n._sounds.length; o++)
                if (e === n._sounds[o]._id) return n._sounds[o];
            return null
        },
        _inactiveSound: function() {
            var e = this;
            e._drain();
            for (var n = 0; n < e._sounds.length; n++)
                if (e._sounds[n]._ended) return e._sounds[n].reset();
            return new t(e)
        },
        _drain: function() {
            var e = this,
                n = e._pool,
                o = 0,
                t = 0;
            if (!(e._sounds.length < n)) {
                for (t = 0; t < e._sounds.length; t++) e._sounds[t]._ended && o++;
                for (t = e._sounds.length - 1; t >= 0; t--) {
                    if (o <= n) return;
                    e._sounds[t]._ended && (e._webAudio && e._sounds[t]._node && e._sounds[t]._node.disconnect(0), e._sounds.splice(t, 1), o--)
                }
            }
        },
        _getSoundIds: function(e) {
            var n = this;
            if (void 0 === e) {
                for (var o = [], t = 0; t < n._sounds.length; t++) o.push(n._sounds[t]._id);
                return o
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            var o = this;
            return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = r[o._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop || 0), e._node.bufferSource.playbackRate.setValueAtTime(e._rate, n.ctx.currentTime), o
        },
        _cleanBuffer: function(e) {
            var o = this,
                t = n._navigator && n._navigator.vendor.indexOf("Apple") >= 0;
            if (n._scratchBuffer && e.bufferSource && (e.bufferSource.onended = null, e.bufferSource.disconnect(0), t)) try {
                e.bufferSource.buffer = n._scratchBuffer
            } catch (e) {}
            return e.bufferSource = null, o
        },
        _clearSound: function(e) {
            /MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (e.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")
        }
    };
    var t = function(e) {
        this._parent = e, this.init()
    };
    t.prototype = {
        init: function() {
            var e = this,
                o = e._parent;
            return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, o._sounds.push(e), e.create(), e
        },
        create: function() {
            var e = this,
                o = e._parent,
                t = n._muted || e._muted || e._parent._muted ? 0 : e._volume;
            return o._webAudio ? (e._node = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(t, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : n.noAudio || (e._node = n._obtainHtml5Audio(), e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._endFn = e._endListener.bind(e), e._node.addEventListener("ended", e._endFn, !1), e._node.src = o._src, e._node.preload = !0 === o._preload ? "auto" : o._preload, e._node.volume = t * n.volume(), e._node.load()), e
        },
        reset: function() {
            var e = this,
                o = e._parent;
            return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, e
        },
        _errorListener: function() {
            var e = this;
            e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1)
        },
        _loadListener: function() {
            var e = this,
                o = e._parent;
            o._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(o._sprite).length && (o._sprite = {
                __default: [0, 1e3 * o._duration]
            }), "loaded" !== o._state && (o._state = "loaded", o._emit("load"), o._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1)
        },
        _endListener: function() {
            var e = this,
                n = e._parent;
            n._duration === 1 / 0 && (n._duration = Math.ceil(10 * e._node.duration) / 10, n._sprite.__default[1] === 1 / 0 && (n._sprite.__default[1] = 1e3 * n._duration), n._ended(e)), e._node.removeEventListener("ended", e._endFn, !1)
        }
    };
    var r = {},
        a = function(e) {
            var n = e._src;
            if (r[n]) return e._duration = r[n].duration, void i(e);
            if (/^data:[^;]+;base64,/.test(n)) {
                for (var o = atob(n.split(",")[1]), t = new Uint8Array(o.length), a = 0; a < o.length; ++a) t[a] = o.charCodeAt(a);
                d(t.buffer, e)
            } else {
                var _ = new XMLHttpRequest;
                _.open(e._xhr.method, n, !0), _.withCredentials = e._xhr.withCredentials, _.responseType = "arraybuffer", e._xhr.headers && Object.keys(e._xhr.headers).forEach(function(n) {
                    _.setRequestHeader(n, e._xhr.headers[n])
                }), _.onload = function() {
                    var n = (_.status + "")[0];
                    if ("0" !== n && "2" !== n && "3" !== n) return void e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".");
                    d(_.response, e)
                }, _.onerror = function() {
                    e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete r[n], e.load())
                }, u(_)
            }
        },
        u = function(e) {
            try {
                e.send()
            } catch (n) {
                e.onerror()
            }
        },
        d = function(e, o) {
            var t = function() {
                    o._emit("loaderror", null, "Decoding audio data failed.")
                },
                a = function(e) {
                    e && o._sounds.length > 0 ? (r[o._src] = e, i(o, e)) : t()
                };
            "undefined" != typeof Promise && 1 === n.ctx.decodeAudioData.length ? n.ctx.decodeAudioData(e).then(a).catch(t) : n.ctx.decodeAudioData(e, a, t)
        },
        i = function(e, n) {
            n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = {
                __default: [0, 1e3 * e._duration]
            }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue())
        },
        _ = function() {
            if (n.usingWebAudio) {
                try {
                    "undefined" != typeof AudioContext ? n.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext : n.usingWebAudio = !1
                } catch (e) {
                    n.usingWebAudio = !1
                }
                n.ctx || (n.usingWebAudio = !1);
                var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform),
                    o = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                    t = o ? parseInt(o[1], 10) : null;
                if (e && t && t < 9) {
                    var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());
                    n._navigator && !r && (n.usingWebAudio = !1)
                }
                n.usingWebAudio && (n.masterGain = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.setValueAtTime(n._muted ? 0 : n._volume, n.ctx.currentTime), n.masterGain.connect(n.ctx.destination)), n._setup()
            }
        };
    "function" == typeof define && define.amd && define([], function() {
        return {
            Howler: n,
            Howl: o
        }
    }), "undefined" != typeof exports && (exports.Howler = n, exports.Howl = o), "undefined" != typeof global ? (global.HowlerGlobal = e, global.Howler = n, global.Howl = o, global.Sound = t) : "undefined" != typeof window && (window.HowlerGlobal = e, window.Howler = n, window.Howl = o, window.Sound = t)
}();
/*! Spatial Plugin */
! function() {
    "use strict";
    HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function(e) {
        var n = this;
        if (!n.ctx || !n.ctx.listener) return n;
        for (var t = n._howls.length - 1; t >= 0; t--) n._howls[t].stereo(e);
        return n
    }, HowlerGlobal.prototype.pos = function(e, n, t) {
        var r = this;
        return r.ctx && r.ctx.listener ? (n = "number" != typeof n ? r._pos[1] : n, t = "number" != typeof t ? r._pos[2] : t, "number" != typeof e ? r._pos : (r._pos = [e, n, t], void 0 !== r.ctx.listener.positionX ? (r.ctx.listener.positionX.setTargetAtTime(r._pos[0], Howler.ctx.currentTime, .1), r.ctx.listener.positionY.setTargetAtTime(r._pos[1], Howler.ctx.currentTime, .1), r.ctx.listener.positionZ.setTargetAtTime(r._pos[2], Howler.ctx.currentTime, .1)) : r.ctx.listener.setPosition(r._pos[0], r._pos[1], r._pos[2]), r)) : r
    }, HowlerGlobal.prototype.orientation = function(e, n, t, r, o, i) {
        var a = this;
        if (!a.ctx || !a.ctx.listener) return a;
        var s = a._orientation;
        return n = "number" != typeof n ? s[1] : n, t = "number" != typeof t ? s[2] : t, r = "number" != typeof r ? s[3] : r, o = "number" != typeof o ? s[4] : o, i = "number" != typeof i ? s[5] : i, "number" != typeof e ? s : (a._orientation = [e, n, t, r, o, i], void 0 !== a.ctx.listener.forwardX ? (a.ctx.listener.forwardX.setTargetAtTime(e, Howler.ctx.currentTime, .1), a.ctx.listener.forwardY.setTargetAtTime(n, Howler.ctx.currentTime, .1), a.ctx.listener.forwardZ.setTargetAtTime(t, Howler.ctx.currentTime, .1), a.ctx.listener.upX.setTargetAtTime(r, Howler.ctx.currentTime, .1), a.ctx.listener.upY.setTargetAtTime(o, Howler.ctx.currentTime, .1), a.ctx.listener.upZ.setTargetAtTime(i, Howler.ctx.currentTime, .1)) : a.ctx.listener.setOrientation(e, n, t, r, o, i), a)
    }, Howl.prototype.init = function(e) {
        return function(n) {
            var t = this;
            return t._orientation = n.orientation || [1, 0, 0], t._stereo = n.stereo || null, t._pos = n.pos || null, t._pannerAttr = {
                coneInnerAngle: void 0 !== n.coneInnerAngle ? n.coneInnerAngle : 360,
                coneOuterAngle: void 0 !== n.coneOuterAngle ? n.coneOuterAngle : 360,
                coneOuterGain: void 0 !== n.coneOuterGain ? n.coneOuterGain : 0,
                distanceModel: void 0 !== n.distanceModel ? n.distanceModel : "inverse",
                maxDistance: void 0 !== n.maxDistance ? n.maxDistance : 1e4,
                panningModel: void 0 !== n.panningModel ? n.panningModel : "HRTF",
                refDistance: void 0 !== n.refDistance ? n.refDistance : 1,
                rolloffFactor: void 0 !== n.rolloffFactor ? n.rolloffFactor : 1
            }, t._onstereo = n.onstereo ? [{
                fn: n.onstereo
            }] : [], t._onpos = n.onpos ? [{
                fn: n.onpos
            }] : [], t._onorientation = n.onorientation ? [{
                fn: n.onorientation
            }] : [], e.call(this, n)
        }
    }(Howl.prototype.init), Howl.prototype.stereo = function(n, t) {
        var r = this;
        if (!r._webAudio) return r;
        if ("loaded" !== r._state) return r._queue.push({
            event: "stereo",
            action: function() {
                r.stereo(n, t)
            }
        }), r;
        var o = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
        if (void 0 === t) {
            if ("number" != typeof n) return r._stereo;
            r._stereo = n, r._pos = [n, 0, 0]
        }
        for (var i = r._getSoundIds(t), a = 0; a < i.length; a++) {
            var s = r._soundById(i[a]);
            if (s) {
                if ("number" != typeof n) return s._stereo;
                s._stereo = n, s._pos = [n, 0, 0], s._node && (s._pannerAttr.panningModel = "equalpower", s._panner && s._panner.pan || e(s, o), "spatial" === o ? void 0 !== s._panner.positionX ? (s._panner.positionX.setValueAtTime(n, Howler.ctx.currentTime), s._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime), s._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime)) : s._panner.setPosition(n, 0, 0) : s._panner.pan.setValueAtTime(n, Howler.ctx.currentTime)), r._emit("stereo", s._id)
            }
        }
        return r
    }, Howl.prototype.pos = function(n, t, r, o) {
        var i = this;
        if (!i._webAudio) return i;
        if ("loaded" !== i._state) return i._queue.push({
            event: "pos",
            action: function() {
                i.pos(n, t, r, o)
            }
        }), i;
        if (t = "number" != typeof t ? 0 : t, r = "number" != typeof r ? -.5 : r, void 0 === o) {
            if ("number" != typeof n) return i._pos;
            i._pos = [n, t, r]
        }
        for (var a = i._getSoundIds(o), s = 0; s < a.length; s++) {
            var p = i._soundById(a[s]);
            if (p) {
                if ("number" != typeof n) return p._pos;
                p._pos = [n, t, r], p._node && (p._panner && !p._panner.pan || e(p, "spatial"), void 0 !== p._panner.positionX ? (p._panner.positionX.setValueAtTime(n, Howler.ctx.currentTime), p._panner.positionY.setValueAtTime(t, Howler.ctx.currentTime), p._panner.positionZ.setValueAtTime(r, Howler.ctx.currentTime)) : p._panner.setPosition(n, t, r)), i._emit("pos", p._id)
            }
        }
        return i
    }, Howl.prototype.orientation = function(n, t, r, o) {
        var i = this;
        if (!i._webAudio) return i;
        if ("loaded" !== i._state) return i._queue.push({
            event: "orientation",
            action: function() {
                i.orientation(n, t, r, o)
            }
        }), i;
        if (t = "number" != typeof t ? i._orientation[1] : t, r = "number" != typeof r ? i._orientation[2] : r, void 0 === o) {
            if ("number" != typeof n) return i._orientation;
            i._orientation = [n, t, r]
        }
        for (var a = i._getSoundIds(o), s = 0; s < a.length; s++) {
            var p = i._soundById(a[s]);
            if (p) {
                if ("number" != typeof n) return p._orientation;
                p._orientation = [n, t, r], p._node && (p._panner || (p._pos || (p._pos = i._pos || [0, 0, -.5]), e(p, "spatial")), void 0 !== p._panner.orientationX ? (p._panner.orientationX.setValueAtTime(n, Howler.ctx.currentTime), p._panner.orientationY.setValueAtTime(t, Howler.ctx.currentTime), p._panner.orientationZ.setValueAtTime(r, Howler.ctx.currentTime)) : p._panner.setOrientation(n, t, r)), i._emit("orientation", p._id)
            }
        }
        return i
    }, Howl.prototype.pannerAttr = function() {
        var n, t, r, o = this,
            i = arguments;
        if (!o._webAudio) return o;
        if (0 === i.length) return o._pannerAttr;
        if (1 === i.length) {
            if ("object" != typeof i[0]) return r = o._soundById(parseInt(i[0], 10)), r ? r._pannerAttr : o._pannerAttr;
            n = i[0], void 0 === t && (n.pannerAttr || (n.pannerAttr = {
                coneInnerAngle: n.coneInnerAngle,
                coneOuterAngle: n.coneOuterAngle,
                coneOuterGain: n.coneOuterGain,
                distanceModel: n.distanceModel,
                maxDistance: n.maxDistance,
                refDistance: n.refDistance,
                rolloffFactor: n.rolloffFactor,
                panningModel: n.panningModel
            }), o._pannerAttr = {
                coneInnerAngle: void 0 !== n.pannerAttr.coneInnerAngle ? n.pannerAttr.coneInnerAngle : o._coneInnerAngle,
                coneOuterAngle: void 0 !== n.pannerAttr.coneOuterAngle ? n.pannerAttr.coneOuterAngle : o._coneOuterAngle,
                coneOuterGain: void 0 !== n.pannerAttr.coneOuterGain ? n.pannerAttr.coneOuterGain : o._coneOuterGain,
                distanceModel: void 0 !== n.pannerAttr.distanceModel ? n.pannerAttr.distanceModel : o._distanceModel,
                maxDistance: void 0 !== n.pannerAttr.maxDistance ? n.pannerAttr.maxDistance : o._maxDistance,
                refDistance: void 0 !== n.pannerAttr.refDistance ? n.pannerAttr.refDistance : o._refDistance,
                rolloffFactor: void 0 !== n.pannerAttr.rolloffFactor ? n.pannerAttr.rolloffFactor : o._rolloffFactor,
                panningModel: void 0 !== n.pannerAttr.panningModel ? n.pannerAttr.panningModel : o._panningModel
            })
        } else 2 === i.length && (n = i[0], t = parseInt(i[1], 10));
        for (var a = o._getSoundIds(t), s = 0; s < a.length; s++)
            if (r = o._soundById(a[s])) {
                var p = r._pannerAttr;
                p = {
                    coneInnerAngle: void 0 !== n.coneInnerAngle ? n.coneInnerAngle : p.coneInnerAngle,
                    coneOuterAngle: void 0 !== n.coneOuterAngle ? n.coneOuterAngle : p.coneOuterAngle,
                    coneOuterGain: void 0 !== n.coneOuterGain ? n.coneOuterGain : p.coneOuterGain,
                    distanceModel: void 0 !== n.distanceModel ? n.distanceModel : p.distanceModel,
                    maxDistance: void 0 !== n.maxDistance ? n.maxDistance : p.maxDistance,
                    refDistance: void 0 !== n.refDistance ? n.refDistance : p.refDistance,
                    rolloffFactor: void 0 !== n.rolloffFactor ? n.rolloffFactor : p.rolloffFactor,
                    panningModel: void 0 !== n.panningModel ? n.panningModel : p.panningModel
                };
                var c = r._panner;
                c ? (c.coneInnerAngle = p.coneInnerAngle, c.coneOuterAngle = p.coneOuterAngle, c.coneOuterGain = p.coneOuterGain, c.distanceModel = p.distanceModel, c.maxDistance = p.maxDistance, c.refDistance = p.refDistance, c.rolloffFactor = p.rolloffFactor, c.panningModel = p.panningModel) : (r._pos || (r._pos = o._pos || [0, 0, -.5]), e(r, "spatial"))
            }
        return o
    }, Sound.prototype.init = function(e) {
        return function() {
            var n = this,
                t = n._parent;
            n._orientation = t._orientation, n._stereo = t._stereo, n._pos = t._pos, n._pannerAttr = t._pannerAttr, e.call(this), n._stereo ? t.stereo(n._stereo) : n._pos && t.pos(n._pos[0], n._pos[1], n._pos[2], n._id)
        }
    }(Sound.prototype.init), Sound.prototype.reset = function(e) {
        return function() {
            var n = this,
                t = n._parent;
            return n._orientation = t._orientation, n._stereo = t._stereo, n._pos = t._pos, n._pannerAttr = t._pannerAttr, n._stereo ? t.stereo(n._stereo) : n._pos ? t.pos(n._pos[0], n._pos[1], n._pos[2], n._id) : n._panner && (n._panner.disconnect(0), n._panner = void 0, t._refreshBuffer(n)), e.call(this)
        }
    }(Sound.prototype.reset);
    var e = function(e, n) {
        n = n || "spatial", "spatial" === n ? (e._panner = Howler.ctx.createPanner(), e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle, e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle, e._panner.coneOuterGain = e._pannerAttr.coneOuterGain, e._panner.distanceModel = e._pannerAttr.distanceModel, e._panner.maxDistance = e._pannerAttr.maxDistance, e._panner.refDistance = e._pannerAttr.refDistance, e._panner.rolloffFactor = e._pannerAttr.rolloffFactor, e._panner.panningModel = e._pannerAttr.panningModel, void 0 !== e._panner.positionX ? (e._panner.positionX.setValueAtTime(e._pos[0], Howler.ctx.currentTime), e._panner.positionY.setValueAtTime(e._pos[1], Howler.ctx.currentTime), e._panner.positionZ.setValueAtTime(e._pos[2], Howler.ctx.currentTime)) : e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]), void 0 !== e._panner.orientationX ? (e._panner.orientationX.setValueAtTime(e._orientation[0], Howler.ctx.currentTime), e._panner.orientationY.setValueAtTime(e._orientation[1], Howler.ctx.currentTime), e._panner.orientationZ.setValueAtTime(e._orientation[2], Howler.ctx.currentTime)) : e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2])) : (e._panner = Howler.ctx.createStereoPanner(), e._panner.pan.setValueAtTime(e._stereo, Howler.ctx.currentTime)), e._panner.connect(e._node), e._paused || e._parent.pause(e._id, !0).play(e._id, !0)
    }
}();

var Sfxloader = pc.createScript("sfxloader");
Sfxloader.attributes.add("descriptor", {
    type: "asset"
}), Sfxloader.attributes.add("atlas", {
    type: "asset"
}), Sfxloader.prototype.initialize = function() {
    SFX.init(this.descriptor.resource.sprite, this.atlas.getFileUrl())
}, Sfxloader.prototype.update = function(t) {};
var PopupIngamePause = pc.createScript("popupIngamePause");
PopupIngamePause.attributes.add("goToMenu", {
    type: "entity"
}), PopupIngamePause.attributes.add("returnToGame", {
    type: "entity"
}), PopupIngamePause.prototype.initialize = function() {}, PopupIngamePause.prototype.show = function() {
    Helper.compositions.showFade(), SFX.menuFadeEngine(), this.entity.script.tween.play();
    var e = Helper.game.timeScale;
    Helper.game.timeScale = 0, this.goToMenu.element.once("click", (function() {
        this.goToMenu.button.active = !1, this.returnToGame.button.active = !1, 
        
        GAMESDK.showAd({
            beforeShowAd: () => {
                SFX.menuFadeEngine()
               
            },
            afterShowAd: () => {
                Helper.screenLevelIndicator.tween.kill(), setTimeout(Helper.game.reloadGame.bind(Helper.game), 50)
                SFX.menuReturnEngine();
            }
        })
    }), this), this.returnToGame.element.once("click", (function() {
        this.entity.script.tween.playReverse(), Helper.compositions.hideFade(), SFX.menuReturnEngine(), Helper.game.timeScale = e
    }), this)
};
GAMESDK.startup()