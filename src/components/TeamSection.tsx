import { Card } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

const team = [
  {
    name: "Mouhamadoul Moustapha DIAGNE",
    role: "CEO - Co-fondateur",
    specialization: "Génie Informatique et Télécoms",
  },
  {
    name: "Ibrahima POUYE",
    role: "CTO - Co-fondateur",
    specialization: "Génie Informatique et Télécoms",
  },
  {
    name: "Gnatam GAYE",
    role: "COO - Co-fondateur",
    specialization: "Génie Informatique et Télécoms",
  },
  {
    name: "Serigne Fallou NGOM",
    role: "CSO - Co-fondateur",
    specialization: "Génie Informatique et Télécoms",
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="section-container relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10 -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-secondary/12 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '7s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '9s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(212,175,55,0.1),transparent_60%)] -z-10" />
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          L'Équipe
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Une équipe d'élèves ingénieurs de l'École Polytechnique de Thiès, spécialisés en génie informatique et télécoms, unis par la volonté de construire un Sénégal souverain et innovant.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
          <span className="text-primary font-semibold">École Polytechnique de Thiès</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, index) => (
          <Card 
            key={index} 
            className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2 border-border bg-card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {member.name === "Mouhamadoul Moustapha DIAGNE" 
                  ? "MD" 
                  : member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{member.name}</h3>
            <p className="text-sm text-secondary font-medium mb-2">{member.role}</p>
            <p className="text-xs text-muted-foreground mb-4">{member.specialization}</p>
            
            {/* Social Links */}
            <div className="flex justify-center gap-3">
              <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                <Linkedin className="h-4 w-4 text-primary" />
              </button>
              <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="inline-block p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <p className="text-foreground font-medium">
            "Nous sommes convaincus que le Sénégal peut devenir un hub industriel et numérique africain. 
            SunuMarket est notre contribution à la Vision 2050."
          </p>
        </Card>
      </div>
    </section>
  );
};

export default TeamSection;
