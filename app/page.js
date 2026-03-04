'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/styles/home.css';

export default function RoleSelector() {
  const router = useRouter();
  const [animate, setAnimate] = useState(false);
  const [titleAnimate, setTitleAnimate] = useState(false); // pour le titre

  useEffect(() => {
    setAnimate(true);
    setTimeout(() => setTitleAnimate(true), 100); // léger délai pour effet
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* TITRE PRINCIPAL */}
        <h1
          style={{
            ...styles.pageTitle,
            ...(titleAnimate ? styles.titleAnimation : styles.titleHidden),
          }}
        >
          Bienvenue à la plateforme NavBot
        </h1>

        {/* SOUS-TITRE */}
        <div style={styles.welcomeText}>
          Veuillez choisir votre profil
        </div>

        <div style={styles.cardsContainer}>
          {/* UTILISATEUR */}
          <div
            style={{
              ...styles.card,
              ...(animate ? styles.cardAnimation : styles.cardHidden),
            }}
            onClick={() => router.push('/account/login/user')}
          >
            <img src="/user.png" style={styles.cardImage} />
            <div style={styles.cardText}>Utilisateur</div>
          </div>

          {/* ADMIN */}
          <div
            style={{
              ...styles.card,
              ...(animate ? styles.cardAnimation : styles.cardHidden),
            }}
            onClick={() => router.push('/account/login/admin')}
          >
            <img src="/admin.png" style={styles.cardImage} />
            <div style={styles.cardText}>Administrateur</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#24386E', // bleu
    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    marginBottom: '20px',
    transition: 'all 1s ease', // transition fluide
  },
  titleHidden: {
    opacity: 0,
    transform: 'translateY(-30px)',
  },
  titleAnimation: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  welcomeText: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '40px',
    color: '#081F5C',
  },
  cardsContainer: {
    display: 'flex',
    gap: '40px',
    justifyContent: 'center',
  },
  card: {
    width: '280px',
    height: '380px',
    background: 'linear-gradient(to bottom, #081F5C, #ffffff)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: '0.4s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  },
  cardHidden: {
    opacity: 0,
    transform: 'translateY(-40px)',
  },
  cardAnimation: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  cardImage: {
    width: '60%',
    marginBottom: '20px',
  },
  cardText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
};
