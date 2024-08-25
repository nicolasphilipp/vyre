export function setActiveItem(id: string): void {
    const navLinkContainer = document.querySelector('.nav-link-container');
    const links = navLinkContainer?.querySelectorAll<HTMLAnchorElement>('a');
    links?.forEach(link => {
      link.classList.remove("wallet-nav-link-active");
    });

    let navLink = document.getElementById(id);
    navLink?.classList.add("wallet-nav-link-active");
}
