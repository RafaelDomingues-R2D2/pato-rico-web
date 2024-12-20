import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Loader2, Search, X } from "lucide-react";
import { useEffect } from "react";
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

	function handlerFilter({
		initialDate,
		endDate,
		categoryId,
	}: TransactionFilterSchema) {
		setSearchParams((prev) => {
			if (initialDate) {
				prev.set("initialDate", String(initialDate));
			} else {
				prev.delete("initialDate");
			}

			if (endDate) {
				prev.set("endDate", String(endDate));
			} else {
				prev.delete("endDate");
			}

			if (categoryId) {
				prev.set("categoryId", String(categoryId));
			} else {
				prev.delete("categoryId");
			}

			prev.set("pageIndex", "1");

			return prev;
		});
	}

	function handleClearFilters() {
		setSearchParams((prev) => {
			prev.set("initialDate", format(startOfMonth(new Date()), "yyyy-MM-dd"));
			prev.set("endDate", format(endOfMonth(new Date()), "yyyy-MM-dd"));
			prev.delete("categoryId");
			prev.set("pageIndex", "1");

			return prev;
		});

		reset({
			initialDate: null,
			endDate: null,
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
		setSearchParams((prev) => {
			prev.set("initialDate", format(startOfMonth(new Date()), "yyyy-MM-dd"));
			prev.set("endDate", format(endOfMonth(new Date()), "yyyy-MM-dd"));

			prev.set("papageIndexge", "1");

			return prev;
		});
	}, []);

	return (
		<form
			onSubmit={handleSubmit(handlerFilter)}
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
