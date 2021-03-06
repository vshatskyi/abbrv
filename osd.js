Layout = imports.ui.layout;

HIDE_TIMEOUT = 200;
FADE_TIME = 0.1;

iteration = (typeof iteration === 'undefined') ? 0 : (iteration + 1);

OsdWindow = new Lang.Class({
    Name: 'OsdWindow' + iteration,

    _init: function(labelText) {
        let monitorIndex = 0;
        this.actor = new imports.gi.St.Widget({ x_expand: true,
            y_expand: true,
            x_align: imports.gi.Clutter.ActorAlign.CENTER,
            y_align: imports.gi.Clutter.ActorAlign.CENTER
        });

        this.actor.add_constraint(new Layout.MonitorConstraint({ index: monitorIndex }));

        let box = new imports.gi.St.BoxLayout({
            style_class: 'osd-window',
            vertical: true
        });

        this.actor.add_actor(box);

        let label = new imports.gi.St.Label({
            width: 500,
            visible: true,
            text: labelText,
            style: 'font-size: 20px; font-weight: normal; margin-top: 15px'
        });

        box.add(label);

        this._hideTimeoutId = 0;

        let monitor = Main.layoutManager.monitors[monitorIndex];
        box.translation_y = -(monitor.height / 10);

        Main.uiGroup.add_child(this.actor);
    },

    show: function() {
        if (!this.actor.visible) {
            this.actor.show();
            this.actor.opacity = 0;
            this.actor.get_parent().set_child_above_sibling(this.actor, null);

            imports.ui.tweener.addTween(this.actor,
                { opacity: 255,
                    time: FADE_TIME,
                    transition: 'easeOutQuad' });
        }

        if (this._hideTimeoutId)
            imports.mainloop.source_remove(this._hideTimeoutId);
        this._hideTimeoutId = imports.mainloop.timeout_add(HIDE_TIMEOUT, () => this._hide());
        GLib.Source.set_name_by_id(this._hideTimeoutId, '[gnome-shell] this._hide');
    },

    cancel: function() {
        if (!this._hideTimeoutId)
            return;

        imports.mainloop.source_remove(this._hideTimeoutId);
        this._hide();
    },

    _hide: function() {
        this._hideTimeoutId = 0;
        imports.ui.tweener.addTween(this.actor,
            { opacity: 0,
                time: FADE_TIME,
                transition: 'easeOutQuad',
                onComplete: () => this.actor.hide()
            });
        return GLib.SOURCE_REMOVE;
    }
});
