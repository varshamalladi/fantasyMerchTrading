exports.index = (req, res)=>{
    let cssfile = "index.css";
    res.render('index', {css: cssfile});
};

exports.error = (req, res)=>{
    let cssfile = "index.css";
    res.render('error', {css: cssfile});
};

exports.about = (req, res)=>{
    let cssfile = "index.css";
    res.render('about', {css: cssfile});
};

exports.contact = (req, res)=>{
    let cssfile = "index.css";
    res.render('contact', {css: cssfile});
};