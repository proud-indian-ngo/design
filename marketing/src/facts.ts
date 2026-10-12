/**
 * The facts the marketing kit prints. They mirror the website's src/content/site.yaml and kalakriti.yaml
 * (proud-indian-ngo/website), which are the source of truth: when one changes there, change it here and re-render.
 */
export const facts = {
  siteShort: "proudindian.ngo",
  email: "connect@proudindian.ngo",
  phone: "+91 99864 31321",
  address:
    "Proud Indian · No. 224, 3rd Floor, WorkFlo Ranka Junction, 80/3, Old Madras Road, KR Puram, Bengaluru 560016",
  donateMin: 100,
  stats: {
    optimists: "3.6k+",
    hours: "14k+",
    reached: "23k+",
    programmes: "95%",
  },
  reg: {
    darpan: "KA/2019/0234065",
    pan: "AAETP0762C",
    csr1: "CSR00053151",
    trust: "INT-4-00864-2018-19",
  },
  links: {
    site: "https://proudindian.ngo/",
    register: "https://dash.proudindian.ngo/register",
    registerShort: "dash.proudindian.ngo/register",
    donate: "https://pages.razorpay.com/proud-indian-ngo-donate",
    kalakriti: "https://proudindian.ngo/kalakriti/",
    kalakritiShort: "proudindian.ngo/kalakriti",
  },
  kalakriti: {
    children: 500,
    events: 8,
    volunteers: 200,
    list: [
      "Singing",
      "Solo dance",
      "Group dance",
      "Painting",
      "Pot painting",
      "Fancy dress",
      "Clay modelling",
      "Rangoli",
    ],
  },
} as const;
