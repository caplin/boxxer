var Tile = function(box) {
    this._box = box;
    this._parentNode = this._box.getElement();
    this.el = document.createElement('div');
    this.el.className = "tile";
    this.el.innerHTML = "<div class=\"askPrice\">1.25</div><div class=\"bidPrice\">1.28</div>";
    this._parentNode.appendChild(this.el);
    this._parentNode.onclick = this.toggle.bind(this);
    this._originalHeight = this._box.getHeight().getValue();
    this._currentHeight = this._originalHeight;
};

Tile.prototype.toggle = function() {
    if (this._currentHeight === this._originalHeight) {
        this._parentNode.style.height = (this._currentHeight * 2) + "px";
        this._currentHeight = this._currentHeight * 2;
        this.el.style.height = "360px";
    } else {
        this._parentNode.style.height = this._originalHeight + "px";
        this._currentHeight = this._originalHeight;
        this.el.style.height = "180px";
    }
};