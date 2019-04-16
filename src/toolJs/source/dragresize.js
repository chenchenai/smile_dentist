if (typeof addEvent != 'function') {
    var addEvent = function(o, t, f, l) {
        var d = 'addEventListener',
            n = 'on' + t,
            rO = o,
            rT = t,
            rF = f,
            rL = l;
        if (o[d] && !l) return o[d](t, f, false);
        if (!o._evts) o._evts = {};
        if (!o._evts[t]) {
            o._evts[t] = o[n] ? {
                b: o[n]
            } : {};
            o[n] = new Function('e', 'var r=true,o=this,a=o._evts["' + t + '"],i;for(i in a){o._f=a[i];r=o._f(e||window.event)!=false&&r;o._f=null}return r');
            if (t != 'unload') addEvent(window, 'unload', function() {
                removeEvent(rO, rT, rF, rL)
            })
        }
        if (!f._i) f._i = addEvent._i++;
        o._evts[t][f._i] = f
    };
    addEvent._i = 1;
    var removeEvent = function(o, t, f, l) {
        var d = 'removeEventListener';
        if (o[d] && !l) return o[d](t, f, false);
        if (o._evts && o._evts[t] && f._i) delete o._evts[t][f._i]
    }
}

function cancelEvent(e, c) {
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (c) {
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation()
    }
};

function DragResize(myName, config) {
    var props = {
        wrapper: null,
        myName: myName,
        enabled: true,
        handles: ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'],
        isElement: null,
        isHandle: null,
        element: null,
        handle: null,
        minWidth: 10,
        minHeight: 10,
        minLeft: 0,
        maxLeft: 9999,
        minTop: 0,
        maxTop: 9999,
        zIndex: 1,
        mouseX: 0,
        mouseY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        mOffX: 0,
        mOffY: 0,
        elmX: 0,
        elmY: 0,
        elmW: 0,
        elmH: 0,
        allowBlur: true,
        ondragfocus: null,
        ondragstart: null,
        ondragmove: null,
        ondragend: null,
        ondragblur: null,
        mouseDownX: null,
        mouseDownY: null,
        newElement: null,
        lastElement: null,
        isSelected: false,
    };
    for (var p in props) this[p] = (typeof config[p] == 'undefined') ? props[p] : config[p]
};
DragResize.prototype.apply = function(node) {
    var obj = this;
    addEvent(node, 'mousedown', function(e) {
        obj.mouseDown(e)
    });
    addEvent(node, 'mousemove', function(e) {
        obj.mouseMove(e)
    });
    addEvent(node, 'mouseup', function(e) {
        obj.mouseUp(e)
    })
};
DragResize.prototype.select = function(newElement) {
    // with(this) {
        if (!document.getElementById || !this.enabled) return;
        if (newElement && (newElement != this.element) && this.enabled) {
            this.element = newElement;
            // element.style.zIndex = ++zIndex;
            if (this.resizeHandleSet) this.resizeHandleSet(this.element, true);
            this.element.className += " drsElementSelected";//添加类
            if(this.element.style.left=="") this.element.style.left = 0;
            this.elmX = parseInt(this.element.style.left);
            if(this.element.style.top=="") this.element.style.top = 0;
            this.elmY = parseInt(this.element.style.top);
            this.elmW = this.element.offsetWidth;
            this.elmH = this.element.offsetHeight;
            if (this.ondragfocus) this.ondragfocus(this.wrapper, this.element)
        }
    // }
};
DragResize.prototype.deselect = function(delHandles) {
    // with(this) {
        if (!document.getElementById || !this.enabled) return;
        if (delHandles) {
            if (this.ondragblur) this.ondragblur(this.wrapper, this.element);
            if (this.resizeHandleSet) this.resizeHandleSet(this.element, false);
            this.element.className = this.element.className.replace(new RegExp( "(\\s|^)drsElementSelected(\\s|$)" ), " ");//移除类
            this.element = null
        }
        this.handle = null;
        this.mOffX = 0;
        this.mOffY = 0
    // }
};
DragResize.prototype.mouseDown = function(e) {
    // with(this) {
        if (!document.getElementById || !this.enabled) return true;
        this.mouseDownX = e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouseDownY = e.pageY || e.clientY + document.documentElement.scrollTop;
        var elm = e.target || e.srcElement,
            newHandle = null,
            hRE = new RegExp(this.myName + '-([trmbl]{2})', '');

        this.newElement = null;
        while (elm) {
            if (elm.className) {
                if (!newHandle && (hRE.test(elm.className) || this.isHandle(elm))) newHandle = elm;
                if (this.isElement(elm)) {
                    this.newElement = elm;
                    break
                }
            }
            elm = elm.parentNode
        }
        if(!this.newElement){
            return;
        }
        if (this.element && (this.element != this.newElement) && this.allowBlur) this.deselect(true);
        if (this.newElement && (!this.element || (this.newElement == this.element))) {
            if (newHandle) cancelEvent(e);
            this.select(this.newElement, newHandle);
            this.handle = newHandle;
            if (this.handle && this.ondragstart) this.ondragstart(this.wrapper, hRE.test(this.handle.className))
        }
    // }
};
DragResize.prototype.isElementHandle = function(elm) {
    // with(this){
        var newElement = null,
            newHandle = null,
            hRE = new RegExp(this.myName + '-([trmbl]{2})', '');
        while (elm) {
            if (elm.className) {
                if (!newHandle && (hRE.test(elm.className) || this.isHandle(elm))) newHandle = elm;
                if (this.isElement(elm)) {
                    newElement = elm;
                    break
                }
            }
            elm = elm.parentNode
        }
        return newElement;
    // }
}
DragResize.prototype.mouseMove = function(e) {
    // with(this) {
        if (!document.getElementById || !this.enabled) return true;
        this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;
        var diffX = this.mouseX - this.lastMouseX + this.mOffX;
        var diffY = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        if (!this.handle) return true;
        var isResize = false;
        if (this.resizeHandleDrag && this.resizeHandleDrag(diffX, diffY)) {
            isResize = true
        } else {
            var dX = diffX,
                dY = diffY;
            if (this.elmX + dX < this.minLeft) this.mOffX = (dX - (diffX = this.minLeft - this.elmX));
            else if (this.elmX + this.elmW + dX > this.maxLeft) this.mOffX = (dX - (diffX = this.maxLeft - this.elmX - this.elmW));
            if (this.elmY + dY < this.minTop) this.mOffY = (dY - (diffY = this.minTop - this.elmY));
            else if (this.elmY + this.elmH + dY > this.maxTop) this.mOffY = (dY - (diffY = this.maxTop - this.elmY - this.elmH));
            this.elmX += diffX;
            this.elmY += diffY
        }
        // with(this.element.style) {
          this.element.style.left = this.elmX + 'px';
          this.element.style.width = this.elmW + 'px';
          this.element.style.top = this.elmY + 'px';
          this.element.style.height = this.elmH + 'px';
        // }
        if (window.opera && document.documentElement) {
            var oDF = document.getElementById('op-drag-fix');
            if (!oDF) {
                var oDF = document.createElement('input');
                oDF.id = 'op-drag-fix';
                oDF.style.display = 'none';
                document.body.appendChild(oDF)
            }
            oDF.focus()
        }
        if (this.ondragmove) this.ondragmove(this.wrapper, isResize, this.element);
        cancelEvent(e)
    // }
};
DragResize.prototype.mouseUp = function(e) {
    // with(this) {
        if (!document.getElementById || !this.enabled) return;
        var elm = e.target || e.srcElement
        var hRE = new RegExp(this.myName + '-([trmbl]{2})', '');
        if (this.handle && this.ondragend) this.ondragend(this.wrapper, hRE.test(this.handle.className), this.element);
        if(this.lastElement == this.element && this.isElementHandle(elm)){
            this.isSelected = true;
        }
        else{
            this.isSelected = false;
        }
        if(this.mouseX==this.mouseDownX && this.mouseY==this.mouseDownY && this.isSelected){
            this.deselect(true);
        }
        this.deselect(false)
        this.lastElement = this.element;
    // }
};
DragResize.prototype.resizeHandleSet = function(elm, show) {
    // with(this) {
        if(!elm) return;
        if (!elm._handle_tr) {
            for (var h = 0; h < this.handles.length; h++) {
                var hDiv = document.createElement('div');
                hDiv.className = this.myName + ' ' + this.myName + '-' + this.handles[h];
                elm['_handle_' + this.handles[h]] = elm.appendChild(hDiv)
            }
        }
        for (var h = 0; h < this.handles.length; h++) {
            elm['_handle_' + this.handles[h]].style.visibility = show ? 'inherit' : 'hidden'
        }
    // }
};
DragResize.prototype.resizeHandleDrag = function(diffX, diffY) {
    // with(this) {
        var hClass = this.handle && this.handle.className && this.handle.className.match(new RegExp(this.myName + '-([tmblr]{2})')) ? RegExp.$1 : '';
        var dY = diffY,
            dX = diffX,
            processed = false;
        if (hClass.indexOf('t') >= 0) {
            rs = 1;
            if (this.elmH - dY < this.minHeight) this.mOffY = (dY - (diffY = this.elmH - this.minHeight));
            else if (this.elmY + dY < this.minTop) this.mOffY = (dY - (diffY = this.minTop - this.elmY));
            this.elmY += diffY;
            this.elmH -= diffY;
            processed = true
        }
        if (hClass.indexOf('b') >= 0) {
            rs = 1;
            if (this.elmH + dY < this.minHeight) this.mOffY = (dY - (diffY = this.minHeight - this.elmH));
            else if (this.elmY + this.elmH + dY > this.maxTop) this.mOffY = (dY - (diffY = this.maxTop - this.elmY - this.elmH));
            this.elmH += diffY;
            processed = true
        }
        if (hClass.indexOf('l') >= 0) {
            rs = 1;
            if (this.elmW - dX < this.minWidth) this.mOffX = (dX - (diffX = this.elmW - this.minWidth));
            else if (this.elmX + dX < this.minLeft) this.mOffX = (dX - (diffX = this.minLeft - this.elmX));
            this.elmX += diffX;
            this.elmW -= diffX;
            processed = true
        }
        if (hClass.indexOf('r') >= 0) {
            rs = 1;
            if (this.elmW + dX < this.minWidth) this.mOffX = (dX - (diffX = this.minWidth - this.elmW));
            else if (this.elmX + this.elmW + dX > this.maxLeft) this.mOffX = (dX - (diffX = this.maxLeft - this.elmX - this.elmW));
            this.elmW += diffX;
            processed = true
        }
        return processed
    // }
};
