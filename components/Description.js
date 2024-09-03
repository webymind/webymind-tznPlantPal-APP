import React from "react";
import Link from "react";
import { Leaf, Heart, Gift } from "lucide-react";

const Description = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
          Explore the Green Wonders of Mauritius with{" "}
          <a
            href="https://tizardin.mu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#82be34] hover:underline"
          >
            Tizardin.mu
          </a>
        </h2>
        <div className="space-y-6 text-lg text-gray-500">
          <p>
            Welcome to a world where technology meets nature! Our plant
            identifier app is a gift to all plant enthusiasts in Mauritius,
            brought to you by Tizardin.mu, your premier online plant nursery.
          </p>
          <div className="flex items-center justify-center text-[#82be34]">
            <Leaf className="mr-2" />
            <span className="font-semibold">
              Powered by passion, driven by innovation
            </span>
          </div>
          <p>
            Founded by the visionary Mireille LK, Tizardin.mu is more than just
            a plant nursery - it's a community for those who see the beauty in
            every leaf and petal. This app is our way of sharing our love for
            plants with every corner of our beautiful island.
          </p>
          <div className="flex items-center justify-center text-[#82be34]">
            <Heart className="mr-2" />
            <span className="font-semibold">
              Free for every plant lover in Mauritius
            </span>
          </div>
          <p>
            Whether you're a seasoned gardener or just starting your green
            journey, this app is here to help you identify and learn about the
            diverse plant species that make Mauritius a tropical paradise.
          </p>
          <div className="flex items-center justify-center text-[#82be34]">
            <Gift className="mr-2" />
            <span className="font-semibold">
              Our gift to nature enthusiasts
            </span>
          </div>
          <p>
            Join us in celebrating the lush biodiversity of Mauritius. With this
            app, every walk becomes an opportunity to discover, every garden a
            classroom, and every plant a new friend waiting to be named.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Description;
