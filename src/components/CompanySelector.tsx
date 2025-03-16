
import { CompanyData } from '@/types';
import { useDelayedAppear } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface CompanySelectorProps {
  companies: CompanyData[];
  selectedCompany: CompanyData | null;
  onSelectCompany: (companyId: string) => void;
}

const CompanySelector = ({ companies, selectedCompany, onSelectCompany }: CompanySelectorProps) => {
  const isVisible = useDelayedAppear(100);
  
  return (
    <div className={cn(
      "h-full w-full flex flex-col space-y-4 p-6 transition-opacity duration-500",
      "bg-custom-company-panel/90 rounded-lg backdrop-blur-lg",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <h2 className="text-xl font-semibold text-white/90 mb-6">Companies</h2>
      
      <div className="flex flex-col space-y-3">
        {companies.map((company, index) => (
          <button
            key={company.companyId}
            onClick={() => onSelectCompany(company.companyId)}
            className={cn(
              "rounded-lg py-3 px-4 text-left transition-all duration-300",
              "hover:bg-white/10 hover:shadow-lg hover:scale-[1.02]",
              "active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
              selectedCompany?.companyId === company.companyId 
                ? "bg-gray-600/40 shadow-md" 
                : "bg-gray-500/20",
              "animate-slide-up",
              { "opacity-0": !isVisible }
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="block text-white font-medium">{company.name}</span>
            <span className="block text-white/60 text-sm mt-1">
              {company.users.length} {company.users.length === 1 ? 'user' : 'users'}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <div className="glass-effect rounded-lg p-4 text-white/80 text-sm">
          <h3 className="font-medium mb-2">Query History Hub</h3>
          <p>Select a company to view user conversations and analytics.</p>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;
