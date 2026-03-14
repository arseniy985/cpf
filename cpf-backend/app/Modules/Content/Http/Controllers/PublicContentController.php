<?php

namespace App\Modules\Content\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Data\ProjectData;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Content\Data\BlogCategoryData;
use App\Modules\Content\Data\BlogPostData;
use App\Modules\Content\Data\CaseStudyData;
use App\Modules\Content\Data\FaqItemData;
use App\Modules\Content\Data\LegalDocumentData;
use App\Modules\Content\Data\ReviewData;
use App\Modules\Content\Data\StaticPageData;
use App\Modules\Content\Domain\Models\BlogCategory;
use App\Modules\Content\Domain\Models\BlogPost;
use App\Modules\Content\Domain\Models\CaseStudy;
use App\Modules\Content\Domain\Models\FaqItem;
use App\Modules\Content\Domain\Models\LegalDocument;
use App\Modules\Content\Domain\Models\Review;
use App\Modules\Content\Domain\Models\StaticPage;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    public function home(): JsonResponse
    {
        $featuredProjects = Project::query()
            ->published()
            ->featured()
            ->with('documents')
            ->limit(3)
            ->get();

        return ApiResponse::success([
            'stats' => [
                'projectsCount' => Project::query()->published()->count(),
                'investorsCount' => InvestmentApplication::query()->distinct('user_id')->count('user_id'),
                'totalInvested' => (int) InvestmentApplication::query()->sum('amount'),
            ],
            'featuredProjects' => ProjectData::collect($featuredProjects),
        ]);
    }

    public function faqs(): JsonResponse
    {
        $items = FaqItem::query()
            ->published()
            ->orderBy('group_name')
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success(FaqItemData::collect($items));
    }

    public function legalDocuments(): JsonResponse
    {
        $documents = LegalDocument::query()
            ->published()
            ->latest('published_at')
            ->get();

        return ApiResponse::success(LegalDocumentData::collect($documents));
    }

    public function page(string $key): JsonResponse
    {
        $page = StaticPage::query()
            ->published()
            ->where('key', $key)
            ->firstOrFail();

        return ApiResponse::success(StaticPageData::fromModel($page));
    }

    public function about(): JsonResponse
    {
        return $this->page('about');
    }

    public function how(): JsonResponse
    {
        return $this->page('how');
    }

    public function contacts(): JsonResponse
    {
        return $this->page('contacts');
    }

    public function reviews(): JsonResponse
    {
        $reviews = Review::query()
            ->published()
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success(ReviewData::collect($reviews));
    }

    public function caseStudies(): JsonResponse
    {
        $items = CaseStudy::query()
            ->published()
            ->latest('published_at')
            ->get();

        return ApiResponse::success(CaseStudyData::collect($items));
    }

    public function blogCategories(): JsonResponse
    {
        return ApiResponse::success(BlogCategoryData::collect(BlogCategory::query()->orderBy('name')->get()));
    }

    public function blogPosts(): JsonResponse
    {
        $posts = BlogPost::query()
            ->published()
            ->with('category')
            ->latest('published_at')
            ->get();

        return ApiResponse::success(BlogPostData::collect($posts));
    }

    public function blogPost(string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->published()
            ->with('category')
            ->where('slug', $slug)
            ->firstOrFail();

        return ApiResponse::success(BlogPostData::fromModel($post));
    }
}
