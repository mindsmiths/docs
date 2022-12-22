import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const TutorialList = [
  {
    title: "Build a conversational partner on top of state-of-the-art AI",
    Image: require("@site/static/img/tutorial1.png").default,
    description: (
      <>
        <p>
          Ready to create your own fun and intelligent chatbot? Follow our
          tutorial and learn how to use the latest technologies in NLP and
          machine learning to create a chatbot that can engage in meaningful
          conversations with users.
        </p>
        <p>
          Don't miss out on this opportunity to create your very own intelligent
          agent – start building now!
        </p>
      </>
    ),
    link: "/docs/tutorials/conversational-ai/introduction",
  },
  {
    title: "Enhance human-machine cooperation in healthcare using AutoML",
    Image: require("@site/static/img/tutorial2.png").default,
    description: (
      <>
        <p>
          Learn how to create a multi-agent system that takes human-machine communication to the next level
          by building complex agents that can learn from experts in real-time with AutoML.
        </p>
        <p>
          Join us in this exciting journey of creating intelligent agents that
          learn from humans.
        </p>
      </>
    ),
    link: "/docs/tutorials/autolearning/introduction",
  },
  {
    title: "Create an enhanced onboarding user experiences on the web in minutes",
    Image: require("@site/static/img/mind.svg").default,
    description: (
      <>
        <p>
          Build an intuitive and engaging user experience on the web
          by using beatiful pre-built components that can build a web-page on the go.
          All in a couple of minutes!
        </p>
        <p>
          Start building your AI-powered dynamic experience now!
        </p>
      </>
    ),
    link: "/docs/tutorials/web-interactions/introduction",
  },
];

function Tutorial({ Image, title, description, link }) {
  return (
    <div className={styles.tutorial + " row"}>
      <div className={styles.contentWrapper + clsx(" col col--6")}>
        <div className="text--left padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
          <a className="button button--primary button--lg" href={link}>
            Start tutorial
          </a>
        </div>
      </div>
      <div className={styles.imageWrapper + clsx(" col col--6")}>
        <img className={styles.tutorialImage} src={Image} />
      </div>
    </div>
  );
}

export default function HomepageTutorials() {
  return (
    <section className={styles.tutorials}>
      <div className="container">
        {TutorialList.map((props, idx) => (
          <Tutorial key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
