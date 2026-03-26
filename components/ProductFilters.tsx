"use client";

interface ProductFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function ProductFilters({
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Поиск */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Сортировка */}
        <div className="w-full md:w-64">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Сначала новые</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>
    </div>
  );
}
