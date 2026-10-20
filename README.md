# OpenLeaf

A clean, modern website for a web and software services studio, with a community blog where every writer gets their own page.

**Live site:** https://sree112027.github.io/openleaf/

## Change the words on the site

All the text lives in [`content.js`](content.js). Open it on GitHub, press the pencil icon, change the words between the quotes and press **Commit changes**. The live site updates about a minute later.

Update these first:

- `contact.email` is a placeholder. Put in the address enquiries should go to.
- `projects` holds example projects. Swap them for real work when you have it.
- `gallery` draws sample screens. To show real pictures, upload them to an `images` folder and set `image: "images/your-photo.jpg"`.

## How the community blog works

- Anyone with a free GitHub account can press **Write a post** on the site. That opens a post form on this repo's Issues tab.
- Each post is an issue with the `blog` label. The site shows every open `blog` issue, grouped by writer, so each person gets their own blog page at `#/blog/their-username`.
- Writers can edit their posts, or close them, on GitHub. Closed posts disappear from the site.
- Readers comment on a post through its GitHub issue.

### Keeping the blog tidy

You own the repo, so you can:

- close an issue, or remove its `blog` label, to hide a post
- lock an issue to stop comments
- block a user from your GitHub settings if someone posts spam

The site reads posts through GitHub's public API, which allows about 60 loads an hour from each visitor's network. The site remembers posts for 3 minutes, so normal browsing stays well under that.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Colours, fonts and layout, in light and dark mode |
| `content.js` | All the words, projects, gallery and contact details |
| `app.js` | Draws the page and loads blog posts from GitHub |
| `.github/ISSUE_TEMPLATE/blog-post.yml` | The Write a post form |
