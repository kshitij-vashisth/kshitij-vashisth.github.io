import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <NavLink to="/" className={styles.logo}>
        <span className={styles.logoSymbol}>∇</span>
        <span className={styles.logoText}>Kkshitij Vasshisth</span>
      </NavLink>

      <div className={`${styles.links} ${open ? styles.open : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} end>Home</NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Simulations</NavLink>
        <NavLink to="/teaching" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Teaching</NavLink>
        <a href="https://github.com/kshitij-vashisth" target="_blank" rel="noreferrer" className={styles.link}>GitHub ↗</a>
      </div>

      <button className={styles.hamburger} onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
    </nav>
  )
}
