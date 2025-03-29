
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            Ready to Transform Your Project Management?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto reveal stagger-1">
            Join thousands of teams who are already using our AI-powered platform
            to accelerate their workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal stagger-2">
          <div className="bg-card rounded-2xl p-6 shadow-sm hover-lift">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p className="text-muted-foreground mb-4">
              Create your account and tell us about your team and workflow needs.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm hover-lift">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Data</h3>
            <p className="text-muted-foreground mb-4">
              Upload your requirements and project documents for the AI to
              analyze.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm hover-lift">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Working Smarter</h3>
            <p className="text-muted-foreground mb-4">
              Let our AI generate tasks, assign stories, and automate your
              workflow.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center reveal stagger-3">
          <Link to="/project-board">
            <Button size="lg" className="px-8 py-6 text-base">
              Try Demo Board <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Start your 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
