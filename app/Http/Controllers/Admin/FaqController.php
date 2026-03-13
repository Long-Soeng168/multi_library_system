<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class FaqController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:faq view', only: ['index', 'show']),
            new Middleware('permission:faq create', only: ['create', 'store']),
            new Middleware('permission:faq update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:faq delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $type_code = $request->input('type_code');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = Faq::query();

        $query->with('created_user', 'updated_user');

        if ($type_code) {
            $query->where('type_code', $type_code);
        }

        // Filter by trashed (soft deletes)
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('question', 'LIKE', "%{$search}%")
                    ->orWhere('question_kh', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('type_code', 'LIKE', "%{$search}%")
                    ->orWhere('answer', 'LIKE', "%{$search}%")
                    ->orWhere('answer_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Faq/Index', [
            'tableData' => $tableData,
            'types' => Type::where('group_code', 'faq-type-group')->orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Faq/Create', [
            'types' => Type::where('group_code', 'faq-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'question' => 'required|string|max:255',
            'question_kh' => 'nullable|string|max:255',
            'answer' => 'nullable|string',
            'answer_kh' => 'nullable|string',
            'order_index' => 'required|numeric',
        ]);
        // dd($request->all());


        try {
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Create the FQA
            Faq::create($validated);

            return redirect()->back()->with('success', 'FQA created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create FQA: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        return Inertia::render('Admin/Faq/Create', [
            'editData' => $faq,
            'readOnly' => true,
            'types' => Type::where('group_code', 'faq-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faq $faq)
    {
        return Inertia::render('Admin/Faq/Create', [
            'editData' => $faq,
            'types' => Type::where('group_code', 'faq-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'question' => 'required|string|max:255',
            'question_kh' => 'nullable|string|max:255',
            'answer' => 'nullable|string',
            'answer_kh' => 'nullable|string',
            'order_index' => 'required|numeric',
        ]);

        try {
            // track updater
            $validated['updated_by'] = $request->user()->id;

            $imageFile = $request->file('image');
            unset($validated['image']);

            // Update
            $faq->update($validated);

            return redirect()->back()->with('success', 'FQA updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update FQA: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $faq = Faq::withTrashed()->findOrFail($id); // 👈 include soft-deleted FQA
        $faq->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'FQA recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $faq->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'FQA deleted successfully.');
    }
}
