// The only two places where the table leaves the page; kept apart so tests can replace them.
export const openInNewTab = (href: string) => {
  window.open(href, "_blank", "noopener");
};

export const navigateTo = (href: string) => {
  window.location.assign(href);
};
