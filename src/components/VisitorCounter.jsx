import { useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase.jsx";

function VisitorCounter() {
  const [targetCount, setTargetCount] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [error, setError] = useState(false);

  const countMotion = useMotionValue(0);
  const color = useTransform(
    countMotion,
    [0, 50, 100, 500, 1000],
    ["#999", "#6b5", "#4a4", "#27ae60", "#e67e22"]
  );

  // Update state when motion value changes
  useEffect(() => {
    const unsubscribe = countMotion.on("change", (latest) => {
      setDisplayedCount(Math.round(latest));
    });
    return () => unsubscribe();
  }, [countMotion]);

  // Fetch and update visitor count
  useEffect(() => {
    async function fetchVisitor() {
      try {
        let userIP = sessionStorage.getItem("user-ip");

        if (!userIP) {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          userIP = ipData.ip;
          sessionStorage.setItem("user-ip", userIP);
        }

        const visitedIPs = JSON.parse(sessionStorage.getItem("visited-ips") || "[]");
        const counterRef = doc(db, "visitors", "count");

        let finalCount;

        if (!visitedIPs.includes(userIP)) {
          const docSnap = await getDoc(counterRef);

          if (!docSnap.exists()) {
            await setDoc(counterRef, { value: 1 });
            finalCount = 1;
          } else {
            await updateDoc(counterRef, { value: increment(1) });
            const updatedSnap = await getDoc(counterRef);
            finalCount = updatedSnap.data().value;
          }

          visitedIPs.push(userIP);
          sessionStorage.setItem("visited-ips", JSON.stringify(visitedIPs));
        } else {
          const docSnap = await getDoc(counterRef);
          finalCount = docSnap.exists() ? docSnap.data().value : 1;
        }

        setTargetCount(finalCount);
      } catch (err) {
        console.error("Visitor counter error:", err);
        setError(true);
      }
    }

    fetchVisitor();
  }, []);

  // Animate count change
  useEffect(() => {
    if (targetCount !== null) {
      const controls = animate(countMotion, targetCount, {
        duration: 1.5,
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [targetCount, countMotion]);

  if (error) return <p>Could not load visitor count.</p>;
  if (targetCount === null) return <p>Loading visitor count...</p>;

  return (
    <motion.p
      style={{
        color,
        fontSize: "1.6rem",
        fontWeight: "bold",
        display: "inline-block"
      }}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {displayedCount}
    </motion.p>
  );
}

export default VisitorCounter;
