import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Users, UserCheck, UserPlus, Search, Download, Eye, Mail, Phone, MapPin, Calendar, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/auth/customers');
      const data = await resp.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { title: "Total Customers", value: customers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Now", value: customers.filter(c => c.is_active).length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "New This Month", value: customers.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length, icon: UserPlus, color: "text-amber-600", bg: "bg-amber-100" }
  ];

  return (
    <div className="space-y-6">
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title text-2xl font-bold text-card-foreground">Customer Directory</h1>
          <p className="page-subtitle text-muted-foreground">Manage and monitor customer accounts and activities</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchCustomers()}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-lg ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.title}</p>
                <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, Name or Email..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border rounded-lg p-1 bg-muted/20">
            <button 
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
            >
                <List className="h-4 w-4" />
            </button>
            <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
            >
                <LayoutGrid className="h-4 w-4" />
            </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer ID</th>
                  <th className="px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined Date</th>
                  <th className="px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-5 py-6 bg-muted/5"></td>
                    </tr>
                )) : filtered.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">{c.customer_id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {c.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-card-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" /> {c.email}</div>
                        <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" /> {c.phone_no || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedCustomer(c)}>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {filtered.map(c => (
               <div key={c.customer_id} className="bg-card border rounded-xl p-5 shadow-sm hover:translate-y-[-2px] transition-all">
                   <div className="flex justify-between items-start mb-4">
                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                           {c.name.charAt(0)}
                       </div>
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                       </span>
                   </div>
                   <h3 className="font-bold text-card-foreground mb-1">{c.name}</h3>
                   <p className="text-xs text-primary font-mono font-semibold mb-3">{c.customer_id}</p>
                   <div className="space-y-2 mb-4">
                       <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {c.email}</div>
                       <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {c.phone_no || 'N/A'}</div>
                   </div>
                   <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => setSelectedCustomer(c)}>View Profile</Button>
               </div>
           ))}
        </div>
      )}

      {selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
              <div className="bg-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="h-24 bg-gradient-to-r from-primary/80 to-primary relative text-white">
                      <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <Eye className="h-4 w-4" />
                      </button>
                      <div className="absolute -bottom-10 left-6">
                           <div className="h-20 w-20 rounded-2xl bg-card p-1 shadow-lg">
                               <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
                                   {selectedCustomer.name.charAt(0)}
                               </div>
                           </div>
                      </div>
                  </div>
                  <div className="pt-12 px-6 pb-6 mt-2">
                       <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-black text-card-foreground">{selectedCustomer.name}</h2>
                                <p className="text-sm font-bold text-primary">{selectedCustomer.customer_id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedCustomer.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {selectedCustomer.is_active ? 'Active Account' : 'Suspended'}
                            </span>
                       </div>

                       <div className="grid grid-cols-1 gap-3 py-4 border-y border-dashed mt-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Email Address</p>
                                    <p className="text-sm font-medium text-card-foreground">{selectedCustomer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Phone Number</p>
                                    <p className="text-sm font-medium text-card-foreground">{selectedCustomer.phone_no || 'Not Provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Customer Since</p>
                                    <p className="text-sm font-medium text-card-foreground">{new Date(selectedCustomer.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                       </div>
                       
                       <div className="mt-6 flex gap-2">
                           <Button className="flex-1 font-bold">Edit Profile</Button>
                           <Button variant="outline" className={`${selectedCustomer.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'} font-bold`}>
                               {selectedCustomer.is_active ? 'Suspend Account' : 'Activate Account'}
                           </Button>
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
