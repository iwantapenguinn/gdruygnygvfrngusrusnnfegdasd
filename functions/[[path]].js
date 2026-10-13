
const OWNER = "iwantapenguinn";
const REPO = "gdruygnygvfrngusrusnnfegdasd";
const BRANCH = "main";

const TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  bmp: "image/bmp",
};

export async function onRequest({ request }) {
  let name;

  try {
    name = decodeURIComponent(
      new URL(request.url).pathname.slice(1)
    );
  } catch {
    return new Response("Not found", { status: 404 });
  }

  if (!name || name.includes("/") || name.includes("\\") ||
      name === "." || name === "..") {
    return new Response("Not found", { status: 404 });
  }

  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot + 1).toLowerCase() : "";
  const base = dot > -1 && TYPES[ext] ? name.slice(0, dot) : name;
  const extensions = TYPES[ext] ? [ext] : Object.keys(TYPES);

  for (const e of extensions) {
    const url =
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/images/${encodeURIComponent(base)}.${e}`;

    const res = await fetch(url);

    if (res.ok) {
      return new Response(res.body, {
        headers: {
          "Content-Type": TYPES[e],
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  }

  return new Response("Image not found", { status: 404 });
}
