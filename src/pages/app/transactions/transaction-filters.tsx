import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Loader2, Search, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { getCategories } from "@/api/get-categories";
import { Button } from "@/components/ui/button";
import { DateRangePickerForm } from "@/components/ui/date-range-picker-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const transactionFilterSchema = z.object({
	initialDate: z.string().optional().nullable(),
	endDate: z.string().optional().nullable(),
	categoryId: z.string().optional(),
});

type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>;

export function TransactionFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const initialDate =
		searchParams.get("initialDate") ??
		format(startOfMonth(new Date()), "yyyy-MM-dd");
	const endDate =
		searchParams.get("endDate") ?? format(endOfMonth(new Date()), "yyyy-MM-dd");
	const categoryId = searchParams.get("categoryId") ?? undefined;

	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories({}),
	});

	const {
		handleSubmit,
		reset,
		setValue,
		control,
		formState: { isSubmitting },
	} = useForm<TransactionFilterSchema>({
		resolver: zodResolver(transactionFilterSchema),
		defaultValues: {
			initialDate:
				initialDate ?? format(startOfMonth(new Date()), "yyyy-MM-dd"),
			endDate: endDate ?? format(endOfMonth(new Date()), "yyyy-MM-dd"),
			categoryId: categoryId ?? "",
		},
	});

	function handleFilter({
		initialDate,
		endDate,
		categoryId,
	}: TransactionFilterSchema) {
		setSearchParams((state) => {
			if (initialDate) {
				state.set("initialDate", String(initialDate));
			} else {
				state.delete("initialDate");
			}

			if (endDate) {
				state.set("endDate", String(endDate));
			} else {
				state.delete("endDate");
			}

			if (categoryId) {
				state.set("categoryId", String(categoryId));
			} else {
				state.delete("categoryId");
			}

			state.set("page", "0");

			return state;
		});
	}

	function handleClearFilters() {
		setSearchParams((state) => {
			state.set("initialDate", format(startOfMonth(new Date()), "yyyy-MM-dd"));
			state.set("endDate", format(endOfMonth(new Date()), "yyyy-MM-dd"));
			state.delete("categoryId");
			state.set("page", "0");

			return state;
		});

		reset({
			initialDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
			endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
			categoryId: "",
		});
	}

	const handleDateRange = (selectedDate: DateRange | undefined) => {
		if (selectedDate) {
			setValue("initialDate", format(selectedDate.from ?? "", "yyyy-MM-dd"));
			setValue("endDate", format(selectedDate.to ?? "", "yyyy-MM-dd"));
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setSearchParams((state) => {
			state.set("initialDate", format(startOfMonth(new Date()), "yyyy-MM-dd"));
			state.set("endDate", format(endOfMonth(new Date()), "yyyy-MM-dd"));

			state.set("page", "0");

			return state;
		});
	}, []);

	return (
		<form
			onSubmit={handleSubmit(handleFilter)}
			className="lg:flex gap-2 items-center"
		>
			<span>Filtros:</span>
			<DateRangePickerForm onSelectDate={handleDateRange} today={true} />
			<Controller
				name="categoryId"
				control={control}
				render={({ field: { name, onChange, value, disabled } }) => {
					return (
						<Select
							name={name}
							onValueChange={onChange}
							value={value}
							disabled={disabled}
						>
							<SelectTrigger className="h-8 w-48">
								<SelectValue placeholder="Categoria" />
							</SelectTrigger>
							<SelectContent>
								{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
								{categories &&
									categories?.categories?.map((category) => {
										return (
											<SelectItem key={category.id} value={category.id}>
												{!category.reservationName ? (
													<span>{category.name}</span>
												) : (
													<span>
														{category.name} - {category.reservationName}
													</span>
												)}
											</SelectItem>
										);
									})}
							</SelectContent>
						</Select>
					);
				}}
			/>

			<Button
				type="submit"
				variant="secondary"
				size="xs"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
				) : (
					<Search className="mr-2 h-4 w-4" />
				)}
				Filtrar resultados
			</Button>

			<Button
				type="button"
				variant="outline"
				size="xs"
				onClick={handleClearFilters}
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
				) : (
					<X className="mr-2 h-4 w-4" />
				)}
				Remover filtros
			</Button>
		</form>
	);
}
