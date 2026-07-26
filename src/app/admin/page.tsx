import { TrendingUp, Users, ShoppingBag, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹2,45,000", change: "+12.5%", icon: <IndianRupee size={24} className="text-emerald-600" /> },
    { label: "Total Orders", value: "156", change: "+8.2%", icon: <ShoppingBag size={24} className="text-blue-600" /> },
    { label: "Total Customers", value: "1,204", change: "+4.3%", icon: <Users size={24} className="text-purple-600" /> },
    { label: "Conversion Rate", value: "3.2%", change: "+1.1%", icon: <TrendingUp size={24} className="text-amber-600" /> },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Priya Sharma", amount: "₹3,499", status: "Pending", date: "Today, 10:23 AM" },
    { id: "ORD-002", customer: "Rahul Verma", amount: "₹1,899", status: "Shipped", date: "Today, 09:15 AM" },
    { id: "ORD-003", customer: "Ananya Patel", amount: "₹5,999", status: "Delivered", date: "Yesterday" },
    { id: "ORD-004", customer: "Vikram Singh", amount: "₹4,299", status: "Confirmed", date: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs font-medium text-emerald-600 mt-1">{stat.change} from last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm font-medium text-[var(--color-primary-gold)] hover:underline">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
