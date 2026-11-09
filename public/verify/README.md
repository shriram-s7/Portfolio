# S Shriram: certifications site

Pages (each group is its own real page and URL):

| Page | File |
|---|---|
| Home (list of groups) | `index.html` |
| AWS / Oracle / NPTEL / Cisco | `aws/index.html`, `oracle/index.html`, `nptel/index.html`, `cisco/index.html` |
| 1M1B x IBM, IIT Madras BS, Google Cloud, Infosys, MongoDB, CodeTantra, LIVEWIRE, CodeGalatta | `1m1b-ibm/`, `iit-madras/`, `google-cloud/`, `infosys/`, `mongodb/`, `codetantra/`, `livewire/`, `codegalatta/` (each has `index.html`) |

## Run
Double-click `index.html`, or serve the folder:

    cd "F:\certificates and badges all\website"
    python -m http.server 8000      # then open http://localhost:8000

To publish, upload the whole folder to Netlify, GitHub Pages or Vercel.

## Test
1. Home shows 12 group cards; the top bar links to every group.
2. Open a group: each certificate shows its preview, copyable code(s), Verify, View certificate.
3. Click Copy, then paste somewhere to confirm.
4. Click Verify on each card; it should open the issuer's page.

## Change something
1. Put new PDFs/images in the parent folder `F:\certificates and badges all`.
2. Edit `build/entries.mjs` (one block per certificate) and `build/groups.mjs` (the groups).
3. `node build/build.mjs`            copies files, rewrites data.js and every page
4. `pip install pymupdf` then `python build/make_thumbs.py`   makes the certificate previews

Only add a verification link you have seen on the certificate (its QR code) or on the issuer's site.
Theme colours and fonts come from `F:\projects\CURRENT PORTFOLIO\src\index.css`.
